import React, { useEffect } from "react";
import './list.css'
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Header from "../../components/header/Header";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
const List = () => {
    const location = useLocation()
    const [destination, setDestination] = useState(location.state.destination);
    const [dates, setDates] = useState(location.state.dates);
    const [openDate, setOpenDate] = useState(false)
    const [min, setMin] = useState(undefined)
    const [max, setMax] = useState(undefined)

    const [options, setOptions] = useState(location.state.options);
    const dataInfo = useFetch(`hotels?city=${destination}&min=${min || 0}&max=${max || 999}`)
    const data=dataInfo.data
    const loading = dataInfo.loading
    const reFetch = dataInfo.reFetch

    const handleClick = () => {
        reFetch()
    }
    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="listContainer">
                <div className="listWrapper">
                    <div className="listSearch">
                        <h1 className="lsTitle">
                            search
                        </h1>
                        <div className="lsItem">
                            <label>Destination</label>
                            <input type="text" placeholder={destination} />
                        </div>
                        <div className="lsItem">
                            <label>check in date</label>
                            <span onClick={() => setOpenDate(!openDate)}>
                                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}
                            </span>
                            {openDate &&
                                <DateRange
                                    onChange={item => setDates([item.selection])}
                                    minDate={new Date()}
                                    ranges={dates}
                                />}
                        </div>
                        <div className="lsItem">
                            <label>Options</label>
                            <div className="lsOptions">
                                <div className="lsOptionItem">
                                    <span className="lsoptionText">Min Price <small>per night</small></span>
                                    <input type="number" onChange={e => setMin(e.target.value)} className="lsOptionInput" />
                                </div>
                                <div className="lsOptionItem">
                                    <span className="lsoptionText">Max Price <small>per night</small></span>
                                    <input type="number" onChange={e => setMax(e.target.value)} className="lsOptionInput" />
                                </div>
                                <div className="lsOptionItem">
                                    <span className="lsoptionText">Adult</span>
                                    <input type="number" className="lsOptionInput" min={1} placeholder={options.adult} />
                                </div>
                                <div className="lsOptionItem">
                                    <span className="lsoptionText" >children</span>
                                    <input type="number" className="lsOptionInput" min={0} placeholder={options.children} />
                                </div>
                                <div className="lsOptionItem">
                                    <span className="lsoptionText">rooms</span>
                                    <input type="number" className="lsOptionInput" min={1} placeholder={options.room} />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleClick}>search</button>

                    </div>
                    <div className="listResult">
                        {loading ? "loading" : <>
                            {data.map((item) => {
                                return (
                                    <SearchItem item={item} key={item._id} />

                                )

                            })}
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default List;