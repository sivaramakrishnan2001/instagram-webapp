import React, { useEffect, useState } from 'react';
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { AppScreensKeys, ComponentsKeys, DrawerPopupPosition, DrawerPopupSize } from "../../connector/AppConfig";
import { StoryVideo } from './StoryVideo';
import { useNavigate } from 'react-router-dom';
import { CreateStory } from './CreateStory';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import { Navigation , Pagination} from 'swiper/modules';


// install Virtual module
// SwiperCore.use([Navigation]);

export const Story = () => {

    const navigat = useNavigate();
    const [story, setStory] = useState([]);
    const [showstory, setShowStory] = useState(false);
    const [selectedrow, setSelectedRow] = useState({});
    const [selectedindex, setSelectedIndex] = useState(0);
    const [user, setUser] = useState({});
    const [showcreatestory, setShowCreateStory] = useState(false);

    // ==============================================================

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        getUserDeatils();
        onGetAllStory();

    }, []);

    // ==============================================================

    const onCreateStory = () => {
        setShowCreateStory(true);
    }

    const onStory = (e, row, inx) => {
        setShowStory(true);
        setSelectedIndex(inx);
        setSelectedRow(row);
        navigat(AppScreensKeys.Home + "/" + ComponentsKeys.STORYS)
    }

    const onOuterClick = () => {
        setShowStory(false);
        setShowCreateStory(false);

    }

    const close = (value) => {
        console.log("value", value);
        let time;
        if (!value) {
            setTimeout(() => {
                time = false;
                return time;
            }, 650);
        } else {
            time = true;
            return time;
        }
    }

    // ==============================================================

    const onGetAllStory = () => {
        var reqObj = {};
        GetRequest(APIsPath.GetAllStorys, reqObj, parseGetAllStoryResponse, parseGetAllStoryError);
    }

    const parseGetAllStoryResponse = (resObj) => {
        if (resObj.status) {
            setStory(resObj.data);
        }
        console.log("resObj", resObj);
    }

    const parseGetAllStoryError = (err) => {
        console.log("parseGetAllStoryError", err);
    }
    // ==============================================================

    const getUserDeatils = () => {
        var reqObj = {};
        GetRequest(APIsPath.GetUser + JSON.parse(localStorage.getItem("user"))?._id, reqObj, parseGetUserDeatilsResponse, parseGetUserDeatilsError);
    }

    const parseGetUserDeatilsResponse = (resObj) => {
        if (resObj.status) {
            setUser(resObj.data);
        }
        console.log("resObj", resObj);
    }

    const parseGetUserDeatilsError = (err) => {
        console.log("parseGetAllStoryError", err);
    }



    // ==============================================================

    return (
        <React.Fragment>
            <div className='story-container'>
                <div className='story-content'>
                    <div className="story add" onClick={(e) => onCreateStory()}>
                        <img src={user?.profile} alt="profile" />
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"

                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                        </svg>
                    </div>

                    {/* <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 40,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 50,
                            },
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        <SwiperSlide>Slide 1</SwiperSlide>
                        <SwiperSlide>Slide 2</SwiperSlide>
                        <SwiperSlide>Slide 3</SwiperSlide>
                        <SwiperSlide>Slide 4</SwiperSlide>
                        <SwiperSlide>Slide 5</SwiperSlide>
                        <SwiperSlide>Slide 6</SwiperSlide>
                        <SwiperSlide>Slide 7</SwiperSlide>
                        <SwiperSlide>Slide 8</SwiperSlide>
                        <SwiperSlide>Slide 9</SwiperSlide>
                    </Swiper> */}

                    {story?.map((row, key) => {
                        return (
                            <div className="story" key={key} onClick={(e) => onStory(e, row, key)}>
                                <img src={row?.user?.profile} alt="profile" />
                            </div>
                        )
                    })}
                </div>
            </div>

            {close(showstory) && <DrawerPopup size={DrawerPopupSize.Full} position={DrawerPopupPosition.Bottom} isopen={showstory} className="sample"
                content={
                    <StoryVideo
                        story={story}
                        selectedrow={selectedrow}
                        selectedindex={selectedindex}
                        onClick={() => setShowStory(false)}
                    />
                }
                OuterClick={onOuterClick}
            />
            }

            {close(showcreatestory) &&
                <DrawerPopup size={DrawerPopupSize.Default} position={DrawerPopupPosition.Right} isopen={showcreatestory} className="sample"
                    content={<CreateStory onClose={() => setShowCreateStory(false)} />}
                    OuterClick={onOuterClick}
                />
            }
        </React.Fragment>
    )
}
