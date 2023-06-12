import React, { useContext } from "react";
import './hotel.css';
import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";


const Hotel = () => {
    const location = useLocation();
    const pathname = location.pathname.split("/")
    const id = pathname[2]
    const [slideNumber, setSlideNumber] = useState(0)
    const [open, setOpen] = useState(false)
    const [openModal,setOpenModal]=useState(false)
    const navigate=useNavigate();
    const {dates,options} = useContext(SearchContext)
    const MILLISECONDS_PER_DAY=1000*60*60*24;
    function dayDifference(startDate,endDate){
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        const timeDiff=Math.abs(date2.getTime()-date1.getTime());
        const dayDiff=Math.ceil(timeDiff/MILLISECONDS_PER_DAY);
        return dayDiff;
    }
    // console.log(dates[0].startDate,dates[0].endDate)
    const days = dayDifference(dates[0].endDate,dates[0].startDate)
    const handleMove = (move) => {
        let newSlideno;
        if (move === "l") {
            newSlideno = slideNumber === 0 ? 5 : slideNumber - 1;
        }
        if (move === "r") {
            newSlideno = slideNumber === 5 ? 0 : slideNumber + 1;
        }
        setSlideNumber(newSlideno)
    }

    const dataHotel = useFetch(`https://bookking-app-manjunathroy.onrender.com/server/hotels/find/${id}`);
    const data = dataHotel.data;
    const loading = dataHotel.loading;
    const {user}=useContext(AuthContext)
    
    const handleClick=()=>{
        if(user){
            setOpenModal(true);
        }else{
            navigate("/login")
        }
    }
    return (
        <div>
            <Navbar />
            <Header type="list" />
            {loading ? "loading" : <><div className="hotelContainer">
                {open &&
                    <div className="slider">
                        <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={() => setOpen(false)} />
                        <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={() => handleMove("l")} />
                        <div className="slideWrapper">
                            <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
                        </div>
                        <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={() => handleMove("r")} />

                    </div>}
                <div className="hotelWrapper">
                    <button className="booknow">Reserve or Book now</button>
                    <h1 className="hotelTitle">{data.name}</h1>
                    <div className="hotelAddress">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>{data.address}</span>
                    </div>
                    <span className="hotelDistance">
                        Excellent Location - {data.distance}m from the center
                    </span>
                    <span className="hotelPriceHighLight">
                        Book a stay for ${data.cheapestPrice} and get a free airport taxi
                    </span>
                    <div className="hotelImgs">
                        {data.photos?.map((photo, i) => {
                            return (
                                <div className="hotelImgWrapper">
                                    <img onClick={() => {
                                        setSlideNumber(i)
                                        setOpen(true)
                                    }} src={photo} alt="" className="hotelImg" />
                                </div>
                            )

                        })}
                    </div>
                    <div className="hotelDetails">
                        <div className="hotelDetailsText">
                            <h1 className="hotelTitle">{data.title}</h1>
                            <p className="hotelDesc">
                                {data.desc}
                            </p>
                        </div>
                        <div className="hotelDetailsPrice">
                            <h1>Perfect for a {days}-night stay!</h1>
                            <span>
                                Located in the real heart of Krakow, this property has an
                                excellent location score of 9.8!
                            </span>
                            <h2>
                                <b>${data.cheapestPrice * days * options.room}</b> ({days} nights)
                            </h2>
                            <button onClick={handleClick}>Reserve or Book Now!</button>
                        </div>
                    </div>
                </div>
                <MailList />
                <Footer />
            </div></>}

            {openModal&& <Reserve setOpen={setOpenModal} hotelId={id} />}

        </div>
    )
}

export default Hotel;