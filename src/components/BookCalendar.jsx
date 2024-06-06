import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Component.css';
import { useState } from "react";
import styled from "styled-components";

function BookCalendar({ onChange, reservedDates, getDateRange }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const isDateInRange = (date, rangeStart, rangeEnd) => {
        return date >= rangeStart && date <= rangeEnd;
    };

    const handleChange = (dates) => {
        const [start, end] = dates;

        if (start && end) {
            const invalidDate = reservedDates.some(date => isDateInRange(date, start, end));
            if (invalidDate) {
                alert("예약 불가능한 날짜입니다.");
                setStartDate(null);
                setEndDate(null);
                onChange([null, null]);
                return;
            }
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
                minDate={new Date()} // 현재 시점의 이전 달 비활성화
                locale={ko}
                isClearable={false}
                monthsShown={2}
                showPopperArrow={false} // 디폴트 스타일로 있는 뾰족한 화살표 없애기
                dateFormat="yyyy/MM/dd"
                excludeDates={reservedDates} // 예약된 날짜 비활성화
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