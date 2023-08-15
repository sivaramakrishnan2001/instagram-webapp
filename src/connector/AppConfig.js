// import { CREATE, EXPLORE, HOME, MESSAGES, MORE, NOTIFICATIONS, REELS, SEARCH } from "../assets/images/svg/Svg";
import { ReactComponent as CREATE } from "../assets/images/svg/create.svg";
import { ReactComponent as EXPLORE } from "../assets/images/svg/explore.svg";
import { ReactComponent as HOME } from "../assets/images/svg/home.svg";
import { ReactComponent as MORE } from "../assets/images/svg/more.svg";
import { ReactComponent as MESSAGES } from "../assets/images/svg/message.svg";
import { ReactComponent as NOTIFICATIONS } from "../assets/images/svg/notification.svg";
import { ReactComponent as REELS } from "../assets/images/svg/reels.svg";
import { ReactComponent as SEARCH } from "../assets/images/svg/search.svg";


export const Me = {
    name: "Sivaramakrishnan S",
    role: "MERN Stack Developer",
    skills: [
        "React.js", "Javascript", 
        "Node.js" ,  "MongoDB", 
        "Express.js", "HTML5", 
        "CSS3", "SCSS", "Git",
        "Swagger API" , "REST API"
    ]
};
// console.log("🤞", Me);




export const LocalStorageKeys = {
    user: localStorage.getItem("user"),
    token: localStorage.getItem("token")
};




export const AppScreensKeys = {
    Home: '/app',
    Login: '/login',
    SignUp: '/signup',
}

export const ComponentsKeys = {
    HOME: "home",
    SEARCH: "search",
    EXPLORE: "explore",
    REELS: "reels",
    MESSAGES: "messages",
    NOTIFICATIONS: "notifications",
    CREATE: "create",
    PROFILE: "profile",
    MORE: "more",
    USERPROFILE: "userprofile",
    STORYS: "storys",
    POSTS:"posts"
};

export const Components = [
    { id: ComponentsKeys.HOME, title: "Home", icon: <HOME /> },
    { id: ComponentsKeys.SEARCH, title: "Search", icon: <SEARCH /> },
    // { id: ComponentsKeys.EXPLORE, title: "Explore", icon: <EXPLORE /> },
    { id: ComponentsKeys.REELS, title: "Reels", icon: <REELS /> },
    { id: ComponentsKeys.MESSAGES, title: "Messages", icon: <MESSAGES /> },
    // { id: ComponentsKeys.NOTIFICATIONS, title: "Notifications", icon: <NOTIFICATIONS /> },
    { id: ComponentsKeys.CREATE, title: "Create", icon: <CREATE /> },
    { id: ComponentsKeys.PROFILE, title: "Profile", icon: <REELS /> },
    // { id: ComponentsKeys.MORE, title: "more", icon: <MORE /> },
    { id: ComponentsKeys.USERPROFILE, title: "User Profile", icon: "" }
];

export const MComponents = [
    { id: ComponentsKeys.HOME, title: "Home", icon: <HOME /> },
    { id: ComponentsKeys.SEARCH, title: "Search", icon: <SEARCH /> },
    { id: ComponentsKeys.CREATE, title: "Create", icon: <CREATE /> },
    { id: ComponentsKeys.REELS, title: "Reels", icon: <REELS /> },
    { id: ComponentsKeys.PROFILE, title: "Profile", icon: <REELS /> },
];



export const SessionStorageKeys = {
    ActiveMenu: "activemenu",
}

export const FileTypes = {
    VIDEO_MP4: "video/mp4",
    VIDEO_X_MATROSKA: "video/x-matroska",
    VIDEO_AVCHD: "video/avchd",
    VIDEO_MOV: "video/mov",
    VIDEO_WMV: "video/wmv",
    VIDEO_AVI: "video/avi",
    VIDEO_FLV: "video/flv",
    VIDEO_F4V: "video/f4v",
    VIDEO_SWF: "video/swf",
    VIDEO_MKV: "video/mkv",
    VIDEO_MPEG: "video/mpeg-2",
    // imgage
    IMAGE_PNG: "image/png",
    IMAGE_JPEG: "image/jpeg",
    IMAGE_JPG: "image/jpg",
    IMAGE_SVG: "image/svg+xml",
    IMAGE_GIF: "image/gif",
    IMAGE_EPS: "image/eps",
    IMAGE_BMP: "image/bmp",
    IMAGE_TIF: "image/tif",
    IMAGE_TIFF: "image/tiff",
    IMAGE_RAW: "image/raw",
    IMAGE_CR2: "image/cr2",
    IMAGE_NEF: "image/nef",
    IMAGE_ORF: "image/orf",
    IMAGE_SR2: "image/sr2",
    // audio
    Audio_MPEG: "audio/mpeg",
    Audio_AAC: "audio/acc",
    Audio_FLAC: "audio/flac",
    Audio_ALAC: "audio/alac",
    Audio_WAV: "audio/wav",
    Audio_AIFF: "audio/aiff",
    Audio_DSD: "audio/dsd",
    Audio_PCM: "audio/pcm",
};

export const VideoTypes = [
    FileTypes.VIDEO_MP4, FileTypes.VIDEO_X_MATROSKA, FileTypes.VIDEO_AVCHD,
    FileTypes.VIDEO_MOV, FileTypes.VIDEO_WMV, FileTypes.VIDEO_AVI,
    FileTypes.VIDEO_FLV, FileTypes.VIDEO_F4V, FileTypes.VIDEO_SWF,
    FileTypes.VIDEO_MKV, FileTypes.VIDEO_MPEG
];

export const ImageTypes = [
    FileTypes.IMAGE_PNG, FileTypes.IMAGE_JPEG, FileTypes.IMAGE_JPG,
    FileTypes.IMAGE_GIF, FileTypes.IMAGE_EPS, FileTypes.IMAGE_BMP,
    FileTypes.IMAGE_TIF, FileTypes.IMAGE_TIFF, FileTypes.IMAGE_RAW,
    FileTypes.IMAGE_CR2, FileTypes.IMAGE_NEF, FileTypes.IMAGE_ORF,
    FileTypes.IMAGE_SR2, FileTypes.IMAGE_SVG
];

export const AudioTypes = [
    FileTypes.Audio_MPEG, FileTypes.Audio_AAC, FileTypes.Audio_FLAC,
    FileTypes.Audio_ALAC, FileTypes.Audio_WAV, FileTypes.Audio_AIFF,
    FileTypes.Audio_DSD, FileTypes.Audio_PCM,
];

export const DrawerPopupSize = {
    Default: "default",
    Full: "full",
    Auto: "auto"
};

export const DrawerPopupPosition = {
    Left: "left",
    Right: "right",
    Bottom: "bottom",
    Top: "top"
}