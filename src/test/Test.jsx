import React, { useEffect, useState } from 'react';
import "./test.css";

export const Test = (props) => {
    const [data, setData] = useState([{}, {}, {}, {}, {}, {}]);
    const [index, setIndex] = useState(0);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        for (let index = 0; index < data.length; index++) {
            if (index === 0) {
                data[index].className = "front";
            } else if (index === 1) {
                data[index].className = "right";
            }
            else if (index === 2) {
                data[index].className = "back";
            }
            else if (index === 3) {
                data[index].className = "left";
            }
            // else if (index === 4) {
            //     data[index].className = "top";
            // }
            // else if (index === 5) {
            //     data[index].className = "bottom";
            // }
        }
        console.log("data", data);

        setReload(ps => !ps);
    }, []);

    useEffect(() => {
        onChangeClassName();
    }, [index]);

    const onChangeClassName = () => {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const inx = index + 1;

            if (index === inx) {
                data[index].className = "front";
            } else if (index === inx + 1) {
                data[index].className = "right";
            }
            else if (index === inx + 2) {
                data[index].className = "back";
            }
            else if (index === inx + 3) {
                data[index].className = "left";
            }
        }
    }

    return (
        <div class="box">
            {data.map((i, k) => {
                return (
                    <div onClick={() => setIndex(k)} key={k} className={i.className}><h1>{k}</h1></div>
                )
            })}
            <div class="top">Top</div>
            <div class="bottom">Bottom</div>
            {/* <div class="front">Front</div>
            <div class="back">Back</div>
            <div class="right">Right</div>
            <div class="left">Left</div>
            <div class="top">Top</div>
            <div class="bottom">Bottom</div> */}
        </div>
    )
}
