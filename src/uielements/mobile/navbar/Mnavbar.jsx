import React, { useContext, useEffect, useState } from 'react';
import "./mnavbar.css";
import { Components, ComponentsKeys, MComponents } from '../../../connector/AppConfig';
import { AuthContext } from '../../../comman/Context';

export const Mnavbar = (props) => {

    const [selected, setSelected] = useState({});
    const auth = useContext(AuthContext);

    // ==============================================================
    
    useEffect(() => {
        if (selected) {
            props && props?.onSelected(selected);
        }
    }, [selected]);

    useEffect(() => {
        setSelected(props &&props?.selected);
    }, [props && props?.selected]);

    // ==============================================================\

    return (
        <div className={'mobile-leftmenu '} style={{ width: auth.auth.width + "px" }}>
            {MComponents.map((row, key) => {

                return (
                    <div key={key} className={row.id === selected.id ? "leftmenu-row active" : "leftmenu-row"} onClick={() => setSelected(row)}>
                        {row.id === ComponentsKeys.PROFILE ?
                            <img src={JSON.parse(localStorage.getItem("user")).profile} />
                            : row?.icon
                        }
                        {/* <div className="title">{row.title}</div> */}
                    </div>
                )
            })}
        </div>
    )
}
