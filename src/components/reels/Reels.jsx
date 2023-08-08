import React, { useEffect, useState } from 'react';
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { CustomRangeVideo } from '../customrange/CustomRange';
import Card from 'react-bootstrap/Card';
import { CreateReels2 } from '../create/CreateReels2';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { DrawerPopupPosition, DrawerPopupSize } from '../../connector/AppConfig';

export const Reels = (props) => {

  const [reels, setReels] = useState([]);
  const [showcreatepost, setShowCreatePost] = useState(false);

  // ==============================================================

  useEffect(() => {
    onGetAllReels();
  }, []);

  const onClose = (status) => {
    console.log("onClose--->",status);
    setShowCreatePost(false);
    if (status === true) {
      onGetAllReels();
    }
  }
  // ==============================================================
  // api calls

  const onGetAllReels = () => {
    var reqObj = {};
    GetRequest(APIsPath.GetAllReels, reqObj, parseGetAllReelsResponse, parseGetAllReelsError);
  }

  const parseGetAllReelsResponse = (resObj) => {
    if (resObj.status) {
      setReels(resObj.data);
    }
    console.log("parseGetAllReelsResponse", resObj);
  }

  const parseGetAllReelsError = (err) => {
    console.log("parseGetAllReelsError", err);
  }

  // ==============================================================

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", overflowY: "scroll", padding: "15px", paddingLeft: "120px" }}>
      <div className="all-posts" style={{ width: "330px", paddingBottom: "20px" }}>
        <Card className='' style={{ width: '100%', height: "130px", boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px", marginTop: "10px" }} onClick={() => setShowCreatePost(true)}>
          <Card.Body style={{ display: "flex", alignItems: "center", padding: "0px", margin: "0px", justifyContent: "center" }}>
            <svg aria-hidden="true" style={{ height: "50px", width: "50px", fill: "gainsboro" }} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
          </Card.Body>
        </Card>
      </div>
      <div className="all-post all-reels" >
        {reels.map((row, key) => {
          return (
            <React.Fragment key={key}>
              <CustomRangeVideo row={row} type="reels" />
              {/* <video controls autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback width="300" height="500">
              <source src={row.url} type="video/mp4" key={key} />
              Your browser does not support the video tag.
            </video>
            <audio controls id="beep">
              <source src={row.song?.song} type="audio/mp3"  />
            </audio> */}
            </React.Fragment>
          )
        })}
      </div>
      {showcreatepost &&
        <DrawerPopup size={DrawerPopupSize.Auto} position={DrawerPopupPosition.Right} isopen={showcreatepost} className="sample"
          content={<CreateReels2 onClose={(s) => onClose(s)} />}
          OuterClick={() => setShowCreatePost(false)}
        />
      }
    </div>
  )
}


