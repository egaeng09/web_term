import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Component.css';
import { useState } from "react";
import styled from "styled-components";

function BookCalendar({ onChange, reservedDates, getDateRange, waitDates }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const isDateInRange = (date, rangeStart, rangeEnd) => {
        return date >= rangeStart && date <= rangeEnd;
    };

    const handleChange = (dates) => {
        console.log(waitDates);
        console.log(reservedDates);
        const [start, end] = dates;

        if (start && end) {
            const invalidDate = reservedDates.some(date => isDateInRange(new Date(date), start, end));
            const waitedDate = waitDates.some(date => isDateInRange(new Date(date), start, end));

            if (invalidDate) {
                alert("예약 불가능한 날짜입니다.");
                setStartDate(null);
                setEndDate(null);
                onChange([null, null]);
                return;
            }

            if (waitedDate) {
                alert("예약 대기 중인 날짜입니다.");
                setStartDate(null);
                setEndDate(null);
                onChange([null, null]);
                return;
            }
        }
        
        if (start.getFullYear() === new Date().getFullYear() && start.getMonth() === new Date().getMonth() && start.getDate() === new Date().getDate()) {
            alert("오늘은 선택할 수 없습니다.");
            setStartDate(null);
            setEndDate(null);
            onChange([null, null]);
            return;
        }

        if (start && end && start.getTime() === end.getTime()) {
            setStartDate(null);
            setEndDate(null);
            onChange([null, null]);
            return;
        }
        
        setStartDate(start);
        setEndDate(end);
        onChange(dates);
        
        getDateRange(start, end);
    };

    return (
        <Container>
            <DatePicker
                selected={startDate}
                onChange={handleChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                minDate={new Date()}
                locale={ko}
                isClearable={false}
                monthsShown={2}
                showPopperArrow={false}
                dateFormat="yyyy/MM/dd"
                renderDayContents={(day, date) => {
                    // TIMEZONE 일치하지 않아 임시 방편 조치!
                    date.setDate(date.getDate() + 1)
                    const isWaited = waitDates.includes(date.toISOString().split('T')[0]);
                    const isAccepted = reservedDates.includes(date.toISOString().split('T')[0]);
                    date.setDate(date.getDate() - 1)
                    return <div className={`${isWaited ? 'waited' : ''}${isAccepted ? 'accepted' : ''}`}>{day}</div>;
                }}
                inline
            />
        </Container>
    );
}

export default BookCalendar;

const Container = styled.div`
    width: 1200px;
    margin: 0 auto;
`;