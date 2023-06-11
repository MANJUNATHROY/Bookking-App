import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faBed, faCalendarDays, faCar, faPerson, faPlane, faTaxi } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns";
import "./header.css"
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";


const Header = ({ type }) => {
    const [destination, setDestination] = useState("")
    const [openDate, setOpenDate] = useState(false);
    const navigate = useNavigate();
    const {user}=useContext(AuthContext)


    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [openOptions, setOpenOptions] = useState(false)
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1
    })

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev, [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            }
        })
    }

    const { dispatch } = useContext(SearchContext)

    const handleSearch = () => {
        dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } })
        navigate("/hotels", { state: { destination, dates, options } })
    }
    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>bed</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Cars</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Attractions</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faTaxi} />
                        <span>Airport Taxi</span>
                    </div>
                </div>
                {type !== "list" &&
                    <div>
                        <h1 className="headerTitle">
                            A lifetime of discounts ? Its genius
                        </h1>
                        <p className="headerDesc">Get rewareded for your travels - unlock instant savings of 10% or more using manujubooking account</p>
                        {!user&&<button className="headerbtn">Sign in/Register</button>}

                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <input type="text" onChange={(e) => setDestination(e.target.value)} placeholder="Where are you going ?" className="headerSearchInput" />
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                                    {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}
                                </span>
                                {openDate &&
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={item => setDates([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        minDate={new Date()}
                                        ranges={dates}
                                        className="date"
                                    />}
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                                <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">
                                    {`${options.adult} adults ${options.children} children ${options.room} rooms`}
                                </span>
                                {openOptions &&
                                    <div className="options">
                                        <div className="optionItems">
                                            <span className="optionText">Adult</span>
                                            <div className="optionCounter">
                                                <button disabled={options.adult <= 1} onClick={() => handleOption("adult", "d")} className="optionCounterButton">-</button>
                                                <button className="optionCounterNumber">{options.adult}</button>
                                                <button onClick={() => handleOption("adult", "i")} className="optionCounterButton">+</button>
                                            </div>
                                        </div>
                                        <div className="optionItems">
                                            <span className="optionText">children</span>
                                            <div className="optionCounter">

                                                <button disabled={options.children <= 1} className="optionCounterButton" onClick={() => handleOption("children", "d")}>-</button>
                                                <button className="optionCounterNumber">{options.children}</button>
                                                <button className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                                            </div>
                                        </div>
                                        <div className="optionItems">
                                            <span className="optionText">Rooms</span>
                                            <div className="optionCounter">
                                                <button disabled={options.room <= 1} className="optionCounterButton" onClick={() => handleOption("room", "d")}>-</button>
                                                <button className="optionCounterNumber">{options.room}</button>
                                                <button className="optionCounterButton" onClick={() => handleOption("room", "i")}>+</button>
                                            </div>
                                        </div>
                                    </div>

                                }


                            </div>
                            <div className="headerSearchItem">
                                <button className="headerbtn" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>}

            </div>

        </div>
    )
}

export default Header;