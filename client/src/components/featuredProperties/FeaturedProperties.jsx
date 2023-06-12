import React from "react";
import "./featuredProperties.css"
import useFetch from "../../hooks/useFetch";

const FeaturedProperties = () => {

    const { data, loading, error } = useFetch("https://bookking-app-manjunathroy.onrender.com/server/hotels/?featured=true")

    return (
        <div className="fp">
            {loading ? "loading" : <>
                {data.map((item) => {
                    return (
                        <div className="fpItem" key={item._id}>
                            <img src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1" alt="" className="fpImg" />
                            <span className="fpName">{item.name}</span>
                            <span className="fpCity">{item.city}</span>
                            <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
                            {item.rating &&
                                <div className="fpRating">
                                    <button>{item.rating}</button>
                                    <span>Excellent</span>
                                </div>}
                        </div>
                    )

                })}
            </>}


        </div>
    )
}

export default FeaturedProperties;