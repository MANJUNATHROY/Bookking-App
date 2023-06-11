import React, { useContext } from "react";
import axios from "axios";
import './reserve.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../../hooks/useFetch";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
    const [selectedRooms, setSelectedRooms] = useState([])
    const dataRoom = useFetch(`/hotels/room/${hotelId}`);
    const data = dataRoom.data;
    const loading = dataRoom.loading;
    const navigate=useNavigate();
    const { dates } = useContext(SearchContext);

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());
        let list = []
        while (date <= end) {
            list.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1)
        }
        return list;
    };
    const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) => allDates.includes(new Date(date).getTime()));
        return !isFound;
    }
    const handleSelect = (e) => {
        const checked = e.target.checked
        const value = e.target.value
        setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter(item => item !== value))
    }

    const handleClick = async() => {
        try{
            await Promise.all(selectedRooms.map(roomId=>{
                const res=axios.put(`/rooms/availability/${roomId}`,{dates:allDates})
                return res.data;
            }))
            setOpen(false)
            navigate("/")
        }catch(err){

        }
    }
    return (
        <div className="reserve">
            <div className="rcontainer">
                <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
                <span>Select your rooms : </span>
                {data.map(item => {
                    return (
                        <div className="rItem">
                            <div className="rItemInfo">
                                <div className="rTitle">{item.title}</div>
                                <div className="rDesc">{item.desc}</div>
                                <div className="rMax">
                                    Max People : <b>{item.maxPeople}</b>
                                </div>
                                <div className="rPrice">{item.price}</div>
                            </div>
                            <div className="rSelectRooms">
                                {item.roomNumbers.map((roomNumber) => {
                                    return (

                                        <div className="room">
                                            <label>{roomNumber.number}</label>
                                            <input
                                                disabled={!isAvailable(roomNumber)}
                                                type="checkbox"
                                                value={roomNumber._id}
                                                onChange={handleSelect} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                <button onClick={handleClick} className="rButton">Reserve Now</button>
            </div>
        </div>
    )
}

export default Reserve;