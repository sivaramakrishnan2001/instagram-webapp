import React, { useRef, useEffect, useState } from 'react';
import "./dropdownwithinputsearch.css";

{/*

// App.jsx 
    const selectedValue = (selectedValue) => {
      console.log("selectedValue" + selectedValue)
    }

    const InputboxdropdownData = [
      { name: "vue" },
      { name: "element" },
      { name: "cooking" },
      { name: "mint-ui" },
      { name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione," },
      { name: "vuex" },
      { name: "vue-router" },
      { name: "babel" },
      { name: "vue js  reactjs" },
      { name: "layout" },
      { name: "dropdown  draganddrop" },
      { name: "design" },
    ];

   <DropdownWithSearchInput
    className="sample"
    placeholder="Search element"
    isEnableRotation={true}
    list={InputboxdropdownData}
    selectedValue={selectedValue}
     /> 

*/}


export const DropdownWithInputSearch = props => {

    const varstore = useRef(undefined);
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isShowOptions, setIsShowOptions] = useState(false);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const [onchange, setOnchange] = useState(false);
    const [top, setTop] = useState();

    // ==============================================================

    useEffect(() => {
        setData(props.list);

    }, []);


    useEffect(() => {
        if (varstore.optionsPanel && isShowOptions) {
            varstore.optionsPanel.focus();
            var panelHeight = varstore.optionsPanel.getBoundingClientRect().height;
            var baseRect = varstore.base.getBoundingClientRect();
            if (panelHeight < (window.innerHeight - baseRect.y - baseRect.height)) {
                setTop(baseRect.height);
            } else {
                setTop(-(panelHeight));
            }
        }
    }, [isShowOptions, data]);

    useEffect(() => {
        var newdata = Object.assign([], props.list);
        newdata = newdata.filter((el) => {
            if (inputValue != '') {
                return el.name.toLowerCase().trim().indexOf(inputValue.toLowerCase().trim()) !== -1;
            }
            else {
                return el.name;
            }
        });
        if (onchange) {
            setData(newdata);
        }
        if (varstore.position) {
            varstore.position.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }

    }, [inputValue]);

    useEffect(() => {
        if (isShowOptions && onchange === false) {
            setInputValue(data[selectedItem].name);
        }
        if (selectedItem > -1) {
            props.selectedValue(data[selectedItem].name);
        }

    }, [selectedItem]);

    useEffect(() => {
        HighlightFunction();

    }, [data]);

    // ==============================================================
    // onChange

    const onInputChange = (e) => {
        setInputValue(e.target.value);
        setIsShowOptions(true);
        setOnchange(true);
        setSelectedItem(undefined);

        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }

    // ==============================================================
    // onClick

    const cancelInputValue = () => {
        setInputValue('');
        setData(props.list);

    }

    const showOptions = () => {
        setIsShowOptions(true);

    }

    const closeOptions = () => {
        setIsShowOptions(false);

    }

    const dealyBlur = () => {
        if (props.onFocusOut) {
            props.onFocusOut();
        }
        setTimeout(() => {
            setIsShowOptions(false);
        }, 150);

    }

    const onSelectionClick = (row) => {
        setInputValue(row.name);

    }

    const keydown = (e) => {

        if (data) {

            if (e.keyCode == '38' && isShowOptions) { // key up
                if (selectedItem === undefined) {
                    if (props.isEnableRotation) {
                        setSelectedItem(data.length - 1);
                    }
                    else {
                        setSelectedItem(undefined);
                    }
                }
                else if (selectedItem === 0) {
                    if (props.isEnableRotation) {
                        setSelectedItem(data.length - 1);

                    } else {
                        setSelectedItem(0);

                    }
                }
                else {
                    setSelectedItem(selectedItem - 1);
                }
            }
            else if (e.keyCode == '40') {
                if (selectedItem === undefined) {// key down
                    setSelectedItem(0);

                }
                else if (data.length - 1 === selectedItem) {
                    if (props.isEnableRotation) {
                        setSelectedItem(0);

                    } else {
                        setSelectedItem(data.length - 1);

                    }
                }
                else {
                    setSelectedItem(selectedItem + 1);

                }
            }
            else if (e.keyCode == '13' && isShowOptions) {
                if (selectedItem != undefined && inputValue === data[selectedItem].name) {
                    setIsShowOptions(false);
                    setSelectedItem(undefined);

                }
            }
        }
    }

    // ==============================================================
    // functions

    const HighlightFunction = () => {
        var filter = varstore.inputRef.value.toLowerCase();
        var li = document.getElementsByClassName('row-drop-item');

        for (var i = 0; i < li.length; i++) {
            var a = li[i].getElementsByTagName("span")[0];
            var txtValue = a.textContent || a.innerText;
            let matchStart = txtValue.toLowerCase().indexOf(filter);

            if (matchStart > -1) {
                const highlighted = document.createElement('span');
                const normal = document.createElement('span');

                a.innerHTML = '';
                a.appendChild(document.createTextNode(txtValue.slice(0, matchStart)));

                highlighted.classList.add('highlighted');
                normal.classList.add('normal');
                highlighted.innerText = txtValue.slice(matchStart, matchStart + filter.length);

                a.appendChild(highlighted);
                normal.innerText = txtValue.slice(matchStart + filter.length);

                a.appendChild(normal);
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    const getClassName = () => {

        var classname = "mf-dropdown-with-input-search " + props.className;

        if (props.disabled) {
            classname += " disabled";
        }

        if (props.isError) {
            classname += " error";
        }

        return classname;
    }

    // ==============================================================

    return (
        <div
            ref={(elem) => varstore.base = elem}
            className={getClassName()}
        >
            <input className='search-box'
                ref={(elem) => varstore.inputRef = elem}
                type="text"
                placeholder={props.placeholder}
                value={inputValue}
                autoComplete="off"
                disabled={props.disabled}

                onChange={(e) => onInputChange(e)}
                onBlur={() => dealyBlur()}
                onClick={() => showOptions()}
                onKeyDown={(e) => { keydown(e) }}
                onKeyUp={() => setOnchange(false)}
                onFocus={() => props.onFocus && props.onFocus()}
            />
            {
                inputValue != '' ?
                    <span className="cancel-icon"
                        onClick={() => cancelInputValue()}>
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" >
                            <path d="m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z"></path>
                            <path d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path>
                        </svg>
                    </span>
                    : ""
            }
            {
                isShowOptions &&
                (<div ref={(elem) => varstore.optionsPanel = elem}
                    className="popup"
                    style={{ top: `${top + "px"}` }}
                    onBlur={() => closeOptions()}>
                    {data.map((row, key) => {
                        return (
                            <div
                                className={selectedItem === key ? "row-drop-item active" : "row-drop-item"}
                                onClick={() => onSelectionClick(row)}
                                ref={(elem) => selectedItem === key ? varstore.position = elem : ""}
                                key={key}  >
                                <span className='data'>{row.name}</span>
                            </div>
                        );
                    })}
                    {data != '' ? "" : <div className='no-suchdatafound'><span className='no-data'> --No Such Data Found--</span></div>}
                </div>)
            }
        </div >
    );
}

