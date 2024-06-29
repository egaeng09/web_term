const express    = require('express');
const mysql      = require('mysql');
const db 		 = require("./db.js");
const path = require('path'); 
const fs = require('fs');

const app = express();
const port = process.env.PORT || '3001';
const hostname = "127.0.0.1";

// app.set('port', port);
// app.set('hostname', hostname);

const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require("multer");

const session = require("express-session");
const MemoryStore = require('memorystore')(session); 

const maxAge = 1000 * 60 * 5; //Specifies the number (in milliseconds)

const sessionObj = {
  secret: "se",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: maxAge }),
  cookie: {
    maxAge: maxAge,
    httpOnly: true,
    secure: false, // HTTPS 사용 시 true로 변경
  },
};
const mySession = session(sessionObj);
app.use(mySession); //다른 미들웨어(login, member..)보다 먼저 적용

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'imgs/'); // 업로드된 파일이 저장될 디렉토리
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

app.use('/imgs', express.static('imgs')); // 정적 파일 경로 설정

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트 URL
    credentials: true
  }));

app.get("/", (req, res) => {
    res.send({success: true});
});

app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});

/* 로직 */

// 로그인
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("/login :", email);
    db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (error, data) => {
      if (!error) {
        if (data.length > 0) {
            req.session.email = email;
            req.session.save((err) => {
                if (err) {
                    return res.status(500).send({ error: '세션 저장 오류' });
                }
                res.send({ login: true, email: req.session.email, type: data[0].user_type, name: data[0].name, id: data[0].user_id });
            });
        } else {
            res.send({ error: "일치하는 회원 정보 없음" });
        }
      } else {
        res.send(error);
      }
    });
});

// 로그아웃
app.post('/logout', (req, res) => {
    console.log("/logout");
    if (req.session.email) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send({ error: "로그아웃 중 에러 발생" });
            } else {
                res.send({ logout: true });
            }
        });
    } else {
        res.status(400).send({ error: "로그인 상태가 아님" });
    }
});

// 캠핑장 검색
app.get('/search/camp', (req, res) => {
  const checkInDate = req.query.check_in_date;
  const checkOutDate = req.query.check_out_date;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).send({ error: 'Missing check_in_date or check_out_date parameter' });
  }

  const sql = `
    SELECT DISTINCT c.campsite_id, c.name
    FROM campsite c
    WHERE c.campsite_id IN (
      SELECT s.campsite_id
      FROM subsite s
      WHERE s.id NOT IN (
        SELECT b.subsite_id
        FROM book b
        WHERE b.subsite_id = s.id
        AND b.check_in_date < ?
        AND b.check_out_date > ?
      )
    );
  `;

  console.log("/search/camp");

  db.query(sql, [checkOutDate, checkInDate], (error, data) => {
    if (!error) {
      res.send({ campsite: data });
    } else {
      res.send(error);
    }
  });
});

// 캠핑장 상세 조회
app.get('/camp', (req, res) => {
    const camp_id = req.query.id;
    console.log("/camp :", camp_id)
    db.query('SELECT * FROM campsite WHERE campsite_id = ' + camp_id, (error, data) => {
        if (!error) res.send({campsite : data});
        else res.send(error);
    })
})

// 캠핑장 편의시설 조회
app.get('/camp/amenity', (req, res) => {
    const camp_id = req.query.id;
    console.log("/camp/amenity :", camp_id)
    db.query('SELECT amenity_id FROM campsite_amenity WHERE campsite_id = ' + [camp_id], (error, amenities) => {
        if (!error) {
            const amenityIds = amenities.map(a => a.amenity_id);
            db.query('SELECT * FROM amenity WHERE amenity_id IN (?) ', [amenityIds], (error, data) => {
                if (!error) res.send({amenities : data});
                else res.send(error);
            })
        }
        else res.send(error);
    })
})

// 캠핑장 별 사이트 리스트 조회
app.get('/camp/sites', (req, res) => {
    const camp_id = req.query.id;
    console.log("/camp/sites :", camp_id)
    db.query('SELECT * FROM subsite WHERE campsite_id = ' + camp_id, (error, data) => {
        if (!error) res.send({subsites : data});
        else res.send(error);
    })
})

// 사이트로 캠핑장 조회
app.get('/site/camp', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/camp :", site_id);
    
    const query = `
        SELECT campsite.* 
        FROM subsite 
        JOIN campsite ON subsite.campsite_id = campsite.campsite_id 
        WHERE subsite.id = ?`;

    db.query(query, [site_id], (error, data) => {
        if (!error) {
            res.send({ campsite: data });
        } else {
            res.send(error);
        }
    });
});

// 사이트 상세 조회
app.get('/site', (req, res) => {
    const site_id = req.query.id;
    console.log("/site :", site_id)
    db.query('SELECT * FROM subsite WHERE id = ' + site_id, (error, data) => {
        if (!error) res.send({subsite : data});
        else res.send(error);
    })
})

// 사이트 이미지 조회
app.get('/site/img', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/img :", site_id)
    db.query('SELECT site_thumbnail FROM subsite WHERE id = ' + site_id, (error, results) => {
        if (error) {
            console.error('SQL Error:', error);
            return res.status(500).send('Failed to fetch image from database');
          }
          if (results.length === 0 || !results[0].site_thumbnail) {
            return res.status(404).send('Image not found');
          }
    
          const imageBuffer = results[0].site_thumbnail;
          res.set('Content-Type', 'image/jpeg');
          res.send(imageBuffer);
        });
})

// 캠핑장 아이디로 사이트 이미지 조회
app.get('/site/imgs', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/imgs :", site_id)
    db.query('SELECT site_thumbnail, id FROM subsite WHERE campsite_id = ' + site_id, (error, results) => {
        if (error) {
            console.error('SQL Error:', error);
            return res.status(500).send('Failed to fetch image from database');
          }
          if (results.length === 0 || !results[0].site_thumbnail) {
            return res.status(404).send('Image not found');
          }
    
          const imageBuffer = results;
          res.set('Content-Type', 'image/jpeg');
          res.send(imageBuffer);
        });
})

// 캠핑장 이미지 조회
app.get('/camp/img', (req, res) => {
    const site_id = req.query.id;
    console.log('/camp/img', site_id)

    db.query(`SELECT thumbnail FROM campsite WHERE campsite_id = ?`, [site_id], (error, results) => {
      if (error) {
        console.error('SQL Error:', error);
        return res.status(500).send('Failed to fetch image from database');
      }
      if (results.length === 0 || !results[0].thumbnail) {
        return res.status(404).send('Image not found');
      }

      const imageBuffer = results[0].thumbnail;
      res.set('Content-Type', 'image/jpeg');
      res.send(imageBuffer);
    });
})

// 캠핑장 이미 예약된 날짜 조회
app.get('/site/booked', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/booked :", site_id)
    db.query('SELECT check_in_date, check_out_date FROM book WHERE cancel = 0 and subsite_id = ' + site_id, (error, data) => {
        if (!error) res.send({dates : data});
        else res.send(error);
    })
})

// 캠핑장 이미 예약된 날짜 조회 (승인)
app.get('/site/booked/accept', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/booked/accept :", site_id)
    db.query('SELECT check_in_date, check_out_date FROM book WHERE accept = 1 and cancel = 0 and subsite_id = ' + site_id, (error, data) => {
        if (!error) res.send({dates : data});
        else res.send(error);
    })
})

// 캠핑장 이미 예약된 날짜 조회 (승인 대기)
app.get('/site/booked/wait', (req, res) => {
    const site_id = req.query.id;
    console.log("/site/booked/wait :", site_id)
    db.query('SELECT check_in_date, check_out_date FROM book WHERE accept = 0 and cancel = 0 and subsite_id = ' + site_id, (error, data) => {
        if (!error) res.send({dates : data});
        else res.send(error);
    })
})

// 캠핑장 리뷰 목록 조회
app.get('/camp/reviews', (req, res) => {
    const camp_id = req.query.id;
    console.log("/camp/reviews :", camp_id)
    const query = `
SELECT
    review.*,
    book.check_in_date,
    book.check_out_date,
    book.adult,
    book.child,
    user.name
FROM
    review
    JOIN book ON review.book_id = book.book_id
    JOIN user ON review.writer_id = user.user_id
    JOIN subsite ON book.subsite_id = subsite.id
    JOIN campsite ON subsite.campsite_id = campsite.campsite_id
WHERE
    campsite.campsite_id = ?;`
    db.query(query, [camp_id], (error, data) => {
        if (!error) res.send({reviews : data});
        else res.send(error);
    })
})

// 리뷰 이미지 조회
app.get('/review/img', (req, res) => {
  const review_id = req.query.id;
  console.log("/review/img :", review_id)
  db.query('SELECT thumbnail FROM review WHERE id = ' + review_id, (error, results) => {
        if (error) {
          console.error('SQL Error:', error);
          return res.status(500).send('Failed to fetch image from database');
        }
        if (results.length === 0 || !results[0].thumbnail) {
          return res.status(404).send('Image not found');
        }
  
        const imageBuffer = results[0].thumbnail;
        res.set('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
      });
})

// 캠핑장 예약
app.post('/book', (req, res) => {
    const param = [req.body.user_id, req.body.subsite_id, req.body.check_in_date, req.body.check_out_date, req.body.adults, req.body.kids, req.body.price, req.body.accept,]
    console.log("/book :", param)
    db.query('INSERT INTO book(`user_id`, `subsite_id`, `check_in_date`, `check_out_date`, `adult`, `child`, `price`, `accept`, `cancel`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)', param, (error, data) => {
        if (!error) {
            res.send({book : data});
            console.log(data);
        }
        else {
            res.send(error);
            console.log(error);
        }
    })
})

// 캠핑장 예약 내역 조회
app.get('/book', (req, res) => {
    const book_id = req.query.id;
    console.log("/book :", book_id)
    db.query('SELECT * FROM book WHERE book_id = ' + book_id, (error, data) => {
        if (!error) {
            res.send({book : data});
        }
        else {
            res.send(error);
        }
    })
})

/* 영재 */

// 예약 정보 가져오기
app.get('/api/reservations', (req, res) => {
    const sql = 'SELECT * FROM book WHERE cancel = 0 and accept = 0';
    db.query(sql, (error, results) => {
      if (error) {
        return res.status(500).send('예약 정보를 불러오는데 실패했습니다: ' + error.message);
      }
      res.json(results);
    });
});

// 주인의 예약 정보 가져오기
app.get('/api/reservations/:owner_id', (req, res) => {
    const { owner_id } = req.params;
    const sql = `SELECT b.*
                FROM book b
                JOIN subsite s ON b.subsite_id = s.id
                JOIN campsite cs ON s.campsite_id = cs.campsite_id
                JOIN user u ON cs.owner_id = u.user_id
                WHERE b.cancel = 0 AND b.accept = 0 AND cs.owner_id = ?;`
    db.query(sql, owner_id, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('예약 정보를 불러오는데 실패했습니다: ' + error.message);
      }
      res.json(results);
    });
});
  
  // 예약 확정 상태 변경
  app.patch('/api/reservations/:bookId', (req, res) => {
    const { bookId } = req.params;
    const sql = 'UPDATE book SET accept = 1 WHERE book_id = ?';
    db.query(sql, [bookId], (error, results) => {
      if (error) {
        return res.status(500).send('예약 확정을 업데이트하는데 실패했습니다: ' + error.message);
      }
      if (results.affectedRows > 0) {
        res.send('예약이 확정되었습니다.');
      } else {
        res.status(404).send('해당 예약을 찾을 수 없습니다.');
      }
    });
  });
  
  // 사용자 정보 사용자Id로 가져오기
  app.get('/api/usersUserId/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM user WHERE user_id = ?';
    db.query(sql, [userId], (error, results) => {
      if (error) {
        return res.status(500).send('사용자 정보를 불러오는데 실패했습니다: ' + error.message);
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("해당 사용자를 찾을 수 없습니다.");
      }
    });
  });
  
  // 캠핑장 등록 API
  app.post("/api/campsites", upload.single("thumbnail"), (req, res) => {
    const {
      owner_id,
      campsite_name,
      campsite_address,
      campsite_contact,
      information,
      check_in_time,
      check_out_time,
      start_manner_time,
      end_manner_time,
    } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const imageBuffer = fs.readFileSync(thumbnail);
  
    const sql = `
      INSERT INTO campsite (
        owner_id, name, address, contact, information,
        check_in_time, check_out_time, thumbnail, start_manner_time, end_manner_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        owner_id,
        campsite_name,
        campsite_address,
        campsite_contact,
        information,
        check_in_time,
        check_out_time,
        imageBuffer,
        start_manner_time,
        end_manner_time,
      ],
      (error, results) => {
        if (error) {
          console.error("SQL Error:", error);
          return res
            .status(500)
            .send(
              "Campsite registration failed due to SQL error: " + error.message
            );
        }
        const campsiteId = results.insertId;
        res
          .status(201)
          .json({
            message: "Campsite registered successfully",
            campsiteId: campsiteId,
          });
      }
    );
  });
  
  // 캠핑하고 편의시설 pk테이블 등록 API
  app.post("/api/campsiteamenities", (req, res) => {
    const { campsite_id, amenity_id } = req.body;
    const sql =
      "INSERT INTO campsite_amenity (campsite_id, amenity_id) VALUES (?, ?)";
    db.query(sql, [campsite_id, amenity_id], (error) => {
      if (error) {
        return res.status(500).send("Failed to add amenity: " + error.message);
      }
      res.status(201).send("Amenity added successfully");
    });
  });
  
  //편의시설 정보 등록 API
  app.post("/api/amenities", (req, res) => {
    const { amenity_name } = req.body;
    const sql = "INSERT INTO amenity (amenity_name) VALUES (?)";
    db.query(sql, [amenity_name], (error, results) => {
      if (error) {
        console.error("SQL Error:", error);
        return res
          .status(500)
          .send("Failed to add amenity due to SQL error: " + error.message);
      }
      const amenityId = results.insertId;
      res
        .status(201)
        .json({ message: "Amenity added successfully", amenityId: amenityId });
    });
  });
  
  //사이트 정보 등록 api
  app.post("/api/subsites", upload.single("site_thumbnail"), (req, res) => {
    const { campsite_id2, site_type, capacity, price } = req.body;
    const site_thumbnail = req.file ? req.file.path : null;
    const imageBuffer = fs.readFileSync(site_thumbnail);
  
    const sql =
      "INSERT INTO subsite (campsite_id, site_type, capacity, price, site_thumbnail) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [campsite_id2, site_type, capacity, price, imageBuffer],
      (error) => {
        if (error) {
          return res.status(500).send("Failed to add subsite: " + error.message);
        }
        res.status(201).send("Subsite added successfully");
      }
    );
  });
  
  // 캠핑장 정보 검색 API
  app.get("/api/campsites/:search", (req, res) => {
    const { search } = req.params;
    console.log(search);
    const sql = "SELECT * FROM campsite WHERE name LIKE ?";
    db.query(sql, [`%${search}%`], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send("No campsite found");
      }
    });
  });
  
  // 캠핑장 정보 캠프아이디로 검색 API
  app.get("/api/campsitesCampId/:campsiteId", (req, res) => {
    const { campsiteId } = req.params;
    const sql = 'SELECT * FROM campsite WHERE campsite_id = ?';
    db.query(sql, [campsiteId], (error, results) => {
      if (error) {
        res.status(500).send('서버 오류가 발생했습니다: ' + error.message);
      } else if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('해당 캠핑장을 찾을 수 없습니다.');
      }
    });
  });
  
  // 사이트 정보 캠프아이디로 검색 API
  app.get("/api/subsites/:campsiteId", (req, res) => {
    const { campsiteId } = req.params;
    const sql = `
      SELECT * FROM subsite
      WHERE campsite_id = ?
    `;
    db.query(sql, [campsiteId], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send("No subsites found for this campsite");
      }
    });
  });
  
  // 캠프 && 편의시설 pk테이블 캠프아이디로 검색 API
  app.get("/api/findCampsiteAmenities/:campsiteId", (req, res) => {
    const { campsiteId } = req.params;
    const sql = `
      SELECT * FROM campsite_amenity
      WHERE campsite_id = ?
    `;
    db.query(sql, [campsiteId], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send("No subsites found for this campsite");
      }
    });
  });
  
  // 편의시설 편의시설id로 검색
  app.get("/api/findAmenity/:amenityId", (req, res) => {
    const { amenityId } = req.params;
    const sql = `
      SELECT * FROM amenity
      WHERE amenity_id = ?
    `;
    db.query(sql, [amenityId], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send("No subsites found for this campsite");
      }
    });
  });
  
  
  // 사이트 정보 사이트 아이디로 검색 API
  app.get("/api/subsitesSubId/:subsiteId", (req, res) => {
    const { subsiteId } = req.params;
    const sql = "SELECT * FROM subsite WHERE id = ?";
    db.query(sql, [subsiteId], (error, results) => {
      if (error) {
        res.status(500).send("서버 오류가 발생했습니다: " + error.message);
      } else if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send("해당 사이트를 찾을 수 없습니다.");
      }
    });
  });
  
  // 캠핑장 정보 업데이트 API
  app.put("/api/campsites/:campsiteId", (req, res) => {
    const { campsiteId } = req.params;
    const {
      campsite_name,
      campsite_address,
      campsite_contact,
      information,
      check_in_time,
      check_out_time,
      start_manner_time,
      end_manner_time,
    } = req.body;
    const sql = `
      UPDATE campsite SET
      name = ?, address = ?, contact = ?, information = ?,
      check_in_time = ?, check_out_time = ?, start_manner_time = ?, end_manner_time = ?
      WHERE campsite_id = ?
    `;
    db.query(
      sql,
      [
        campsite_name,
        campsite_address,
        campsite_contact,
        information,
        check_in_time,
        check_out_time,
        start_manner_time,
        end_manner_time,
        campsiteId,
      ],
      (error, results) => {
        if (error) {
          console.error("SQL Error:", error);
          return res
            .status(500)
            .send("Campsite update failed due to SQL error: " + error.message);
        }
        res.status(200).send("Campsite updated successfully");
      }
    );
  });
  
  // 사이트 정보 업데이트 API
  app.put("/api/subsites/:subsiteId", (req, res) => {
    const { subsiteId } = req.params;
    const { site_type, capacity, price } = req.body;
    const sql =
      "UPDATE subsite SET site_type = ?, capacity = ?, price = ? WHERE id = ?";
    db.query(
      sql,
      [site_type, capacity, price, subsiteId],
      (error, results) => {
        if (error) {
          return res.status(500).send(error.message);
        }
        res.status(200).send("Subsite updated successfully");
      }
    );
  });
  
  // 사이트 삭제 API
  app.delete("/api/subsites/:subsiteId", (req, res) => {
    const { subsiteId } = req.params;
    const sql = "DELETE FROM subsite WHERE id = ?";
    db.query(sql, [subsiteId], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      res.status(200).send("Subsite deleted successfully");
    });
  });

// 편의시설 정보 업데이트 API
app.put('/api/amenityUp/:amenityId', (req, res) => {
    const { amenityId } = req.params;
    const { amenity_name } = req.body;
    console.log("편의시설 아이디값: ", amenityId);
    console.log("편의시설 이름: ", amenity_name);
  
    const sql = 'UPDATE amenity SET amenity_name = ? WHERE amenity_id = ?';
    db.query(sql, [amenity_name, amenityId], (error, results) => {
      if (error) {
        console.error('편의시설 정보 업데이트 실패:', error);
        return res.status(500).json({ message: '편의시설 정보 업데이트 실패' });
      }
      res.status(200).json({ message: '편의시설 정보가 성공적으로 업데이트되었습니다.' });
    });
  });



/* 영빈 */

// 캠핑장 목록 가져오기 API
app.get('/campsites', async (req, res) => {
    const { name, check_in_date, check_out_date, location, type } = req.query;

    
    let query = `
    SELECT DISTINCT c.campsite_id, c.name
    FROM Campsite c
    JOIN Subsite s ON c.campsite_id = s.campsite_id
    LEFT JOIN Book b ON s.id = b.subsite_id
    WHERE 1=1
  `;
  
  let params = [];
  
  if (check_in_date && check_out_date) {
    query += ` AND s.id NOT IN (
      SELECT b1.subsite_id
      FROM Book b1
      WHERE b1.subsite_id = s.id
      AND b1.check_in_date < ?
      AND b1.check_out_date > ?
    )`
    params.push(check_out_date);
    params.push(check_in_date)
  } 
  if (name) {
    query += ' AND c.name LIKE ?';
    params.push(`%${name}%`);
  }
  
  if (location) {
    query += ' AND c.address LIKE ?';
    params.push(`%${location}%`);
  }
  
  if (type) {
    query += ' AND s.site_type = ?';
    params.push(type);
  }
  
    db.query(query, params, (error, results) => {
      if (error) {
        console.error('error:', error);
        return res.status(500).json({ message: "err" });
      }
      res.status(200).json({ data: results });
      console.log(results);
    });
});

//

app.get('/book/result/:user_id', (req, res) => {

  const { user_id } = req.params;

  console.log('/book/result : ', user_id);

  db.query(`
    SELECT b.book_id, b.check_in_date, b.check_out_date, b.child, b.adult, b.price, b.accept, b.cancel,
           s.site_type, s.capacity, c.name, c.campsite_id
    FROM Book b
    JOIN Subsite s ON b.subsite_id = s.id
    JOIN Campsite c ON s.campsite_id = c.campsite_id
    WHERE b.user_id = ?
  `, [user_id], (error, bookRows) => {
    if (error) {
      console.error('예약 목록 가져오기 실패:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!bookRows || bookRows.length === 0) {
      console.log('예약 목록이 비어있습니다.');
      return res.status(404).json({ message: '예약 목록이 비어있습니다.' });
    }

    console.log('bookRows:', bookRows);

    const reservations = [];

    // Use a loop to handle each book row
    for (const book of bookRows) {
      db.query('SELECT * FROM Review WHERE book_id = ?', [book.book_id], (reviewError, reviewRows) => {
        if (reviewError) {
          console.error('리뷰 조회 실패:', reviewError);
          // Handle error in fetching reviews if needed
          return;
        }

        const reservation = {
          ...book,
          review: (reviewRows && reviewRows.length > 0) ? reviewRows[0] : null,
          status: getStatusText(book.accept, book.cancel, book.check_out_date)
        };
        reservations.push(reservation);

        // Check if all reservations are processed before sending response
        if (reservations.length === bookRows.length) {
          console.log('reservations:', reservations);
          res.json(reservations);
        }
      });
    }
  });
});

const getStatusText = (accept, cancel, checkOutDate) => {
  const currentDate = new Date();
  const checkOut = new Date(checkOutDate);

  if (accept === 0 && cancel === 0) {
    return '예약대기';
  } else if (accept === 1 && cancel === 0) {
    if (checkOut < currentDate) {
      return '예약종료';
    } else {
      return '예약확정';
    }
  } else if (cancel === 1) {
    return '취소';
  } else {
    return '알 수 없음';
  }
};

// 예약 취소 API
app.post('/book/cancel', (req, res) => {
  const { bookId } = req.body;
  db.query('UPDATE Book SET cancel = 1 WHERE book_id = ?', [bookId], (error, result) => {
    if (error) {
      console.error('예약 취소 실패:', error.message);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: '예약 취소 성공!' });
  });
});

// 리뷰 작성 API
app.post('/review', upload.single('image'), async (req, res) => {
  const { reservationId, reviewContent, userId, star } = req.body;
  const reviewThumbnail = req.file ? req.file.path : null;
  const imageBuffer = fs.readFileSync(reviewThumbnail);

  try {
    const query = 'INSERT INTO Review (writer_id, book_id, content, star, created_at, thumbnail) VALUES (?, ?, ?, ?, NOW(), ?)';
    const params = [userId, reservationId, reviewContent, star, imageBuffer];

    db.query(query, params, (error, result) => {
      if (error) {
        console.error('리뷰 작성 실패:', error);
        return res.status(500).json({ error: '리뷰 작성에 실패했습니다.' });
      }

      // 성공적으로 삽입되었을 때의 응답
      res.status(200).json({ message: '리뷰가 성공적으로 작성되었습니다.', reviewId: result.insertId });
    });
  } catch (err) {
    console.error('리뷰 작성 API 오류:', err);
    res.status(500).json({ error: err.message });
  }
});