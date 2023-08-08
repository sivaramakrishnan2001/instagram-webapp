import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { AppScreensKeys } from '../../connector/AppConfig';
import { signInWithPopup, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { auth, provider } from '../../firebase';
import { GoogleSignInButton } from '../../uielements/buttons/Buttons';
import siva from "../../assets/images/jpg/siva.jpg"

export const Login = () => {

	const varstore = useRef(null);
	const navigate = useNavigate();

	const [reload, setReload] = useState(false);

	useEffect(() => {
		varstore.email.focus();
		varstore.email.value = "";
		varstore.password.value = "";

	}, []);

	// ==============================================================
	// onClick

	const onLogin = () => {
		onLoginApiCall();

	}

	// ==============================================================
	// APIs

	const onLoginApiCall = () => {
		var reqObj = {
			body: {
				email: varstore.email.value, password: varstore.password.value
			}
		};
		PostRequest(APIsPath.Login, reqObj, parseSignUpApiCallResponse, parseSignUpApiCallError);
	}

	const parseSignUpApiCallResponse = (res) => {
		if (res.status) {
			localStorage.setItem('token', JSON.stringify(res.data.token));
			localStorage.setItem('user', JSON.stringify(res.data.user));
			varstore.email.value = "";
			varstore.password.value = "";
			if (localStorage.getItem("token")) {
				setTimeout(() => {
					navigate(AppScreensKeys.Home, {
						state: {
							user: res.data.user,
							token: res.data.token
						}
					});
					setReload((ps) => !ps);

				}, 300);
			}

			setReload((ps) => !ps);

			<Navigate to={AppScreensKeys.Login} />

		} else {

		}
		console.log("parseSignUpApiCallResponse", res);
	}

	const parseSignUpApiCallError = (err) => {
		console.log("parseSignUpApiCallError", err);

	}

	// ==============================================================

	return (
		<div className='card'>
			<input
				ref={(elem) => varstore.email = elem}
				type="text"
				value={varstore.email}
				placeholder='email'
				onKeyDown={(e) => e.key === "Enter" ? varstore.password.focus() : ""} />
			<input
				ref={(elem) => varstore.password = elem}
				type="text"
				value={varstore.password}
				placeholder='password'
				onKeyDown={(e) => e.key === "Enter" ? onLogin() : ""} />
			<div onClick={() => navigate(AppScreensKeys.SignUp)}>signup</div>
			<button onClick={onLogin}>login</button>
		</div>
	)
}


export const Login2 = () => {

	const varstore = useRef(null);
	const navigate = useNavigate();
	const [state, setState] = useState({ email: "", password: "", token: "" });
	const [reload, setReload] = useState(false);
	const [toggleForm, setToggleForm] = useState(false);

	// ==============================================================

	useEffect(() => {
		varstore.email.focus();

	}, []);

	const onChangeInputValue = (e, id) => {
		if (id === "email") {
			state.email = e.target.value;
		} else if (id === "password") {
			state.password = e.target.value;
		}
		setReload(ps => !ps);
	}

	// ==============================================================
	// onClick

	const onLogin = (e) => {
		// e.preventdefault();
		console.log("lsjdfjskf");
		if (!state.email || !state.password) {
			alert("please enter the value");
			return;
		}
		onLoginApiCall();
	}

	const onSignUp = () => {
		onSignUpApiCall();
	}

	const onLoginGoogleAuth = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				console.log("token", token);
				// The signed-in user info.
				const user = result.user;
				console.log("user", user);
				// IdP data available using getAdditionalUserInfo(result)
				let reqObj = {
					body: {
						name: user.displayName,
						email: user.email,
						number: user.phoneNumber
					}
				}
				PostRequest(APIsPath.FirebaseAuthentication, reqObj, (resObj) => {
					if (resObj.status) {
						localStorage.setItem('token', JSON.stringify(resObj.data.token));
						localStorage.setItem('user', JSON.stringify(resObj.data.user));
						navigate(AppScreensKeys.Home, {
							state: {
								token: resObj.data.token,
								user: resObj.data.user
							}
						});
					}
					console.log("resObj", resObj);
				}, (err) => {
					console.log("err", err);
				})
			}).catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	}

	// ==============================================================
	// functions

	// ==============================================================
	// APIs

	const onLoginApiCall = () => {
		var reqObj = { body: { email: state.email, password: state.password } };
		PostRequest(APIsPath.Login, reqObj, parseLoginApiCallResponse, parseLoginApiCallError);
	}

	const parseLoginApiCallResponse = (res) => {
		if (res.status) {
			localStorage.setItem('token', JSON.stringify(res.data.token));
			localStorage.setItem('user', JSON.stringify(res.data.user));
			setState({ ...state, password: "", email: "", token: res.data.token });

			setReload((ps) => !ps);
			navigate(AppScreensKeys.Home, {
				state: {
					token: res.data.token,
					user: res.data.user
				}
			});
			// <Navigate to={AppScreensKeys.Home} />
			setReload((ps) => !ps);
		}
		console.log("parseLoginApiCallResponse", res);
	}

	const parseLoginApiCallError = (err) => {
		console.log("parseLoginApiCallError", err);
	}

	// ==============================================================

	const onSignUpApiCall = () => {
		if (!state.name || !state.email || !state.password) {
			alert("all fields required");
			return;
		}
		var data = {
			body: {
				name: state.name, email: state.email, password: state.password
			}
		};
		PostRequest(APIsPath.SignUp, data, parseSignUpApiCallResponse, parseSignUpApiCallError);
	}

	const parseSignUpApiCallResponse = (res) => {
		if (res.status) {
			setState({ ...state, email: "", password: "", token: "", confirmpassword: "", username: "" });
			varstore.signin.click();

		}
		console.log("parseSignUpApiCallResponse", res);

	}

	const parseSignUpApiCallError = (err) => {
		console.log("parseSignUpApiCallError", err);
	}

	// ==============================================================

	return (
		<section>
			<div className={toggleForm ? "container active" : "container"}>
				<div className="user signinBx">
					<div className="imgBx">
						<svg xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "100%" }} data-name="Layer 1" viewBox="0 0 865.67004 711.47194" className="active"><path id="be762e0f-b118-45b0-834c-015dca31fdfd-647" data-name="Path 339" d="M611.15112,263.156h-3.9V156.179a61.915,61.915,0,0,0-61.915-61.915h-226.65a61.915,61.915,0,0,0-61.916,61.914V743.062a61.915,61.915,0,0,0,61.915,61.915h226.648a61.915,61.915,0,0,0,61.915-61.915V339.304h3.9Z" transform="translate(-167.16498 -94.26403)" fill="#3f3d56"></path><path id="bd19cda7-6ee4-487f-8299-09f5b9520cce-648" data-name="Path 340" d="M594.62415,152.032V747.207a46.959,46.959,0,0,1-46.942,46.952h-231.3a46.966,46.966,0,0,1-46.973-46.952V152.032a46.965,46.965,0,0,1,46.971-46.951h28.058a22.329,22.329,0,0,0,20.656,30.74h131.868a22.329,22.329,0,0,0,20.656-30.74h30.055a46.959,46.959,0,0,1,46.951,46.942Z" transform="translate(-167.16498 -94.26403)" fill="#fff"></path><path d="M540.92969,666.47461H327.31787a29.01035,29.01035,0,0,1-28.97754-28.97754V336.99268c0-72.96192,59.3584-132.3208,132.32031-132.3208H540.93018a29.00984,29.00984,0,0,1,28.97705,28.97705V637.49707A29.01,29.01,0,0,1,540.92969,666.47461Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><circle id="be454a6a-b415-4179-b5e8-57164f143cba" data-name="Ellipse 7" cx="147.3572" cy="629.16794" r="15.37866" fill="#e6e6e6"></circle><circle id="be5a0c73-855d-427d-a69e-6f1eaa4c04a0" data-name="Ellipse 7" cx="386.86341" cy="629.16794" r="15.37866" fill="#e6e6e6"></circle><polygon points="388.948 571.619 379.414 582.009 334.805 550.181 348.876 534.847 388.948 571.619" fill="#ffb6b6"></polygon><path d="M568.61505,672.47461,537.87532,705.9738l-.42372-.38879a17.69746,17.69746,0,0,1-1.07478-25.00335l.00076-.00083.97238-10.379L552.469,663.045l2.6834-2.92427Z" transform="translate(-167.16498 -94.26403)" fill="#2f2e41"></path><polygon points="395.181 687.559 381.081 687.558 374.373 633.171 395.184 633.172 395.181 687.559" fill="#ffb6b6"></polygon><path d="M565.94229,795.49106l-45.46567-.00169v-.57507a17.69746,17.69746,0,0,1,17.69651-17.69622h.00112l8.3049-6.30054,15.4951,6.3015,3.96888.00016Z" transform="translate(-167.16498 -94.26403)" fill="#2f2e41"></path><path id="a30b4662-e5c2-40ab-b3a2-3f3e92442cbc-649" data-name="Path 17" d="M494.25411,507.266s-86.138,83.167-31.683,108.91h16.831s5.058-17.96928,16.63727-33.12264c1.59018-2.081,7.54741-1.65826,9.20179-3.68636,10.10141-12.38329,21.05261-23.01828,28.61594-22.596l4.95,57.425-2.44219,16.83068a88.19336,88.19336,0,0,0,1.19448,31.8341v0l-1.72229,67.17524,30.20227.01737s1.21985-15.74366,2.24025-35.43474c.27336-5.2751,2.54231-8.95037,2.75975-14.56526.5213-13.461-1.20641-29.12982-1.53928-40.11539l22.772-120.791Z" transform="translate(-167.16498 -94.26403)" fill="#2f2e41"></path><path id="bce5c948-7db7-43f8-8cd2-61a9f17c0c07-650" data-name="Path 22" d="M534.03937,331.05331,519.9941,349.842l-33.663,19.8,19.8,51.484.751,38.30649-1.84277,4.62082,2.08174,7.56768s-.96062,8.85672-6.08174,15.43232c-8.95362,11.49658-22.62583,23.99213-8.76926,27.14169,21.782,4.951,99.009,15.841,102.969,6.931,1.36981-3.08208,1.19966-16.11578.391-31.84754-.15122-2.94186-3.40079-6.142-3.59077-9.22515-.14254-2.31334,2.7817-4.48913,2.62314-6.83525-1.7669-26.14462-4.3734-53.081-4.3734-53.081l7.75026-72.0837-31-8-3.48025-8.8723Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path id="aa56653d-a1eb-49b2-bba0-f0dc0c583c83-651" data-name="Path 18" d="M458.43521,611.2356l4.60416,5.81771s42.34451,29.62482,43.79856,32.39338l6.69207,6.33242,16.19225-17.30872-8.4206-10.55436a66.10234,66.10234,0,0,0-25.35712-19.41327h0l-12.90514-11.44945Z" transform="translate(-167.16498 -94.26403)" fill="#2f2e41"></path><path d="M485.34141,528.08817l7.71109-74.63911,2.0353-30.719-21.58313-3.90266s-3.232,21.11786-6.05941,33.51076c-2.79018,12.22915,3.717,74.11131,3.88946,75.74334a10.50079,10.50079,0,1,0,14.00669.00667Z" transform="translate(-167.16498 -94.26403)" fill="#ffb9b9"></path><path d="M457.45534,465.98817l37.2588,9.45768-.2588-10.45768,2.82782-3,5.65-29.59722,8.1062-17.33764L508.93221,355.764l-20.58858,10.91954-.02512.01933a55.66255,55.66255,0,0,0-8.928,13.21991c-7.76154,15.77858-15.21745,50.53309-19.12034,70.71918a2.203,2.203,0,0,1-.74252,1.07,11.41536,11.41536,0,0,0-2.07235,14.27622Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path d="M678.71622,485.04417s-45.35878-47.82044-45.78176-48.72177c-3.16847-24.06114-12.28147-34.67474-13.6476-33.5225L595.766,410.94839s6.99625,22.15475,11.73316,35.31426c4.5263,12.57444,56.69257,43.288,57.56313,44.80437a11.188,11.188,0,1,0,13.654-6.02285Z" transform="translate(-167.16498 -94.26403)" fill="#ffb9b9"></path><path d="M576.77281,349.69891s23.08916-11.31585,32.04437,10.909c4.90935,12.547,17.46581,42.998,23.72314,61.743a1.40067,1.40067,0,0,0,.17043.33618,15.241,15.241,0,0,1,2.59638,8.40918,2.862,2.862,0,0,0,.06763.64912s-25.37273,4.94306-32.91942,18.2428l-2.99331-3.24832-.53212-2.27586-21.89054-58.41068Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path d="M953.83625,440.40682H683.514a9.09549,9.09549,0,0,1-9.085-9.085V391.731a9.09549,9.09549,0,0,1,9.085-9.085H953.83625a9.09549,9.09549,0,0,1,9.085,9.085v39.59082A9.09549,9.09549,0,0,1,953.83625,440.40682Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><path d="M927.57111,434.27889H689.64337a9.09549,9.09549,0,0,1-9.085-9.085V397.86385a9.0955,9.0955,0,0,1,9.085-9.085H947.70832a9.0955,9.0955,0,0,1,9.085,9.085v7.19288A29.2551,29.2551,0,0,1,927.57111,434.27889Z" transform="translate(-167.16498 -94.26403)" fill="#fff"></path><path d="M845.49982,408.71005H736.85089a2.343,2.343,0,1,1,0-4.686H845.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path d="M900.49982,418.29305H736.85089a2.343,2.343,0,1,1,0-4.686H900.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><path d="M953.83625,524.40682H683.514a9.09549,9.09549,0,0,1-9.085-9.085V475.731a9.09549,9.09549,0,0,1,9.085-9.085H953.83625a9.09549,9.09549,0,0,1,9.085,9.085v39.59082A9.09549,9.09549,0,0,1,953.83625,524.40682Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><path d="M927.57111,518.27889H689.64337a9.09549,9.09549,0,0,1-9.085-9.085V481.86385a9.0955,9.0955,0,0,1,9.085-9.085H947.70832a9.0955,9.0955,0,0,1,9.085,9.085v7.19288A29.2551,29.2551,0,0,1,927.57111,518.27889Z" transform="translate(-167.16498 -94.26403)" fill="#fff"></path><path d="M845.49982,492.71005H736.85089a2.343,2.343,0,1,1,0-4.686H845.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path d="M900.49982,502.29305H736.85089a2.343,2.343,0,1,1,0-4.686H900.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><path d="M953.83625,608.40682H683.514a9.09549,9.09549,0,0,1-9.085-9.085V559.731a9.09549,9.09549,0,0,1,9.085-9.085H953.83625a9.09549,9.09549,0,0,1,9.085,9.085v39.59082A9.09549,9.09549,0,0,1,953.83625,608.40682Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><path d="M927.57111,602.27889H689.64337a9.09549,9.09549,0,0,1-9.085-9.085V565.86385a9.0955,9.0955,0,0,1,9.085-9.085H947.70832a9.0955,9.0955,0,0,1,9.085,9.085v7.19288A29.2551,29.2551,0,0,1,927.57111,602.27889Z" transform="translate(-167.16498 -94.26403)" fill="#fff"></path><path d="M845.49982,576.71005H736.85089a2.343,2.343,0,1,1,0-4.686H845.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#6c63ff"></path><path d="M900.49982,586.29305H736.85089a2.343,2.343,0,1,1,0-4.686H900.49982a2.343,2.343,0,0,1,0,4.686Z" transform="translate(-167.16498 -94.26403)" fill="#e6e6e6"></path><circle id="f8b50a69-a369-42b8-943f-f14ba4f1f80f" data-name="Ellipse 5" cx="381.67412" cy="202.48596" r="28.272" fill="#ffb9b9"></circle><path d="M528.05143,314.93262a3.0924,3.0924,0,0,1-.99736-.16085,6.53654,6.53654,0,0,1-3.014-2.679c-4.86764-7.00083-7.218-16.33485-6.98492-27.74314.09849-4.82636.64469-10.99714,4.02469-15.916,2.84239-4.13608,8.59213-7.41845,13.95049-5.77081a5.79219,5.79219,0,0,1,2.8897-5.34718c2.02955-1.24293,4.47283-1.47173,6.628-1.6743,5.44223-.51008,11.0681-1.03735,16.57871.00688,6.179,1.172,11.2311,4.35671,13.861,8.7375l.05376.13762.53459,2.596a2.46521,2.46521,0,0,0,3.28237,1.81063,2.23672,2.23672,0,0,1,3.00152,2.41447l-.14924,1.03262,1.55431-.29074a2.23775,2.23775,0,0,1,2.50952,2.97487l-.43911,1.18745a2.3539,2.3539,0,0,1,1.71128.7535,2.16367,2.16367,0,0,1,.29332,2.54908,20.27084,20.27084,0,0,1-7.1604,7.20426,16.923,16.923,0,0,1-5.23278,2.05793,100.50121,100.50121,0,0,1-36.46,1.09628,20.55532,20.55532,0,0,1,.815,7.38016c-.38793,3.11249-2.21534,5.68092-4.65561,6.54323a11.24288,11.24288,0,0,1-1.7014.4103,9.97584,9.97584,0,0,0-1.62441.39481,4.75374,4.75374,0,0,0-1.39174,8.12464l1.20337-1.25411-.39137,1.5943a2.2875,2.2875,0,0,1-1.16638,1.45238A3.20545,3.20545,0,0,1,528.05143,314.93262Z" transform="translate(-167.16498 -94.26403)" fill="#2f2e41"></path><path d="M921.34506,741.8203l1.14386-25.71947a83.066,83.066,0,0,1,38.74474-9.80779c-18.60844,15.21377-16.28294,44.5407-28.899,64.99962a49.96435,49.96435,0,0,1-36.63939,23.08922l-15.5722,9.53437a83.72448,83.72448,0,0,1,17.647-67.84511A80.87282,80.87282,0,0,1,912.633,722.261C916.36256,732.09516,921.34506,741.8203,921.34506,741.8203Z" transform="translate(-167.16498 -94.26403)" fill="#f2f2f2"></path><path d="M1032.835,804.546a1.18647,1.18647,0,0,1-1.19006,1.19H168.355a1.19,1.19,0,0,1,0-2.38h863.29A1.18651,1.18651,0,0,1,1032.835,804.546Z" transform="translate(-167.16498 -94.26403)" fill="#ccc"></path></svg>
						{/* <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img1.jpg" alt="" /> */}
						{/* <img src={siva} alt="img" /> */}
					</div>
					<div className="formBx">
						<form>
							<h2>Sign In</h2>
							<input
								ref={(elem) => varstore.email = elem}
								type="text"
								name=""
								onChange={(e) => onChangeInputValue(e, "email")}
								value={state.email}
								placeholder='Email'
								onKeyDown={(e) => e.key === "Enter" ? varstore.password.focus() : ""}
							/>
							<input
								placeholder="Password"
								ref={(elem) => varstore.password = elem}
								type="text"
								value={state.password}
								onChange={(e) => onChangeInputValue(e, "password")}
								onKeyDown={(e) => e.key === "Enter" ? onLogin(e) : ""}
							/>
							<div className='button' type="submit" name="" value="Login" onClick={(e) => onLogin(e)} >Login</div>
							<div className="button" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
								<GoogleSignInButton onClick={(e) => onLoginGoogleAuth(e)} />
							</div>


							<p className="signup">
								Don't have an account ?
								<a href="#" onClick={() => {
									setToggleForm(true);
									setState({ ...state, email: "", password: "", token: "", confirmpassword: "", username: "" });
								}}>Sign Up.</a>
							</p>
						</form>
					</div>
				</div>
				<div className="user signupBx">
					<div className="formBx">
						<form >
							<h2>Create an account</h2>
							<input type="text" onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Username" />
							<input type="email" onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Email Address" />
							<input type="password" onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Create Password" />
							<input type="password" onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Confirm Password" />
							{/* <input type="submit"  value="Sign Up" /> */}
							<div className='button' type="submit" value="Login" onClick={(e) => onSignUp(e)} >Sign Up</div>

							{/* <div className="button" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' ,paddingTop:"20px"}}>
								<GoogleSignInButton onClick={(e) => onLoginGoogleAuth(e)} />
							</div> */}
							<p className="signup">
								Already have an account ?
								<a href="#" ref={(elem) => varstore.signin = elem} onClick={() => {
									setToggleForm(false);
									setState({ ...state, email: "", password: "", token: "", confirmpassword: "", username: "" });
								}} >Sign in.</a>
							</p>
						</form>
					</div>
					<div className="imgBx">
						<svg xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "100%" }} data-name="Layer 1" viewBox="0 0 744.84799 747.07702" className="active"><path id="fa3b9e12-7275-481e-bee9-64fd9595a50d-163" data-name="Path 1" d="M299.205,705.80851l-6.56-25.872a335.96693,335.96693,0,0,0-35.643-12.788l-.828,12.024-3.358-13.247c-15.021-4.29394-25.24-6.183-25.24-6.183s13.8,52.489,42.754,92.617l33.734,5.926-26.207,3.779a135.92592,135.92592,0,0,0,11.719,12.422c42.115,39.092,89.024,57.028,104.773,40.06s-5.625-62.412-47.74-101.5c-13.056-12.119-29.457-21.844-45.875-29.5Z" transform="translate(-227.576 -76.46149)" fill="#f2f2f2"></path><path id="bde08021-c30f-4979-a9d8-cb90b72b5ca2-164" data-name="Path 2" d="M361.591,677.70647l7.758-25.538a335.93951,335.93951,0,0,0-23.9-29.371l-6.924,9.865,3.972-13.076c-10.641-11.436-18.412-18.335-18.412-18.335s-15.315,52.067-11.275,101.384l25.815,22.51-24.392-10.312a135.91879,135.91879,0,0,0,3.614,16.694c15.846,55.234,46.731,94.835,68.983,88.451s27.446-56.335,11.6-111.569c-4.912-17.123-13.926-33.926-24.023-48.965Z" transform="translate(-227.576 -76.46149)" fill="#f2f2f2"></path><path id="b3ac2088-de9b-4f7f-bc99-0ed9705c1a9d-165" data-name="Path 22" d="M747.327,253.4445h-4.092v-112.1a64.883,64.883,0,0,0-64.883-64.883H440.845a64.883,64.883,0,0,0-64.883,64.883v615a64.883,64.883,0,0,0,64.883,64.883H678.352a64.883,64.883,0,0,0,64.882-64.883v-423.105h4.092Z" transform="translate(-227.576 -76.46149)" fill="#e6e6e6"></path><path id="b2715b96-3117-487c-acc0-20904544b5b7-166" data-name="Path 23" d="M680.97,93.3355h-31a23.02,23.02,0,0,1-21.316,31.714H492.589a23.02,23.02,0,0,1-21.314-31.714H442.319a48.454,48.454,0,0,0-48.454,48.454v614.107a48.454,48.454,0,0,0,48.454,48.454H680.97a48.454,48.454,0,0,0,48.454-48.454h0V141.7885a48.454,48.454,0,0,0-48.454-48.453Z" transform="translate(-227.576 -76.46149)" fill="#fff"></path><path id="b06d66ec-6c84-45dd-8c27-1263a6253192-167" data-name="Path 6" d="M531.234,337.96451a24.437,24.437,0,0,1,12.23-21.174,24.45,24.45,0,1,0,0,42.345A24.43391,24.43391,0,0,1,531.234,337.96451Z" transform="translate(-227.576 -76.46149)" fill="#ccc"></path><path id="e73810fe-4cf4-40cc-8c7c-ca544ce30bd4-168" data-name="Path 7" d="M561.971,337.96451a24.43594,24.43594,0,0,1,12.23-21.174,24.45,24.45,0,1,0,0,42.345A24.43391,24.43391,0,0,1,561.971,337.96451Z" transform="translate(-227.576 -76.46149)" fill="#ccc"></path><circle id="a4813fcf-056e-4514-bb8b-e6506f49341f" data-name="Ellipse 1" cx="364.43401" cy="261.50202" r="24.45" fill="#6c63ff"></circle><path id="bbe451c3-febc-41ba-8083-4c8307a2e73e-169" data-name="Path 8" d="M632.872,414.3305h-142.5a5.123,5.123,0,0,1-5.117-5.117v-142.5a5.123,5.123,0,0,1,5.117-5.117h142.5a5.123,5.123,0,0,1,5.117,5.117v142.5A5.123,5.123,0,0,1,632.872,414.3305Zm-142.5-150.686a3.073,3.073,0,0,0-3.07,3.07v142.5a3.073,3.073,0,0,0,3.07,3.07h142.5a3.073,3.073,0,0,0,3.07-3.07v-142.5a3.073,3.073,0,0,0-3.07-3.07Z" transform="translate(-227.576 -76.46149)" fill="#ccc"></path><rect id="bb28937d-932f-4fdf-befe-f406e51091fe" data-name="Rectangle 1" x="218.56201" y="447.10197" width="218.552" height="2.047" fill="#ccc"></rect><circle id="fcef55fc-4968-45b2-93bb-1a1080c85fc7" data-name="Ellipse 2" cx="225.46401" cy="427.41999" r="6.902" fill="#6c63ff"></circle><rect id="ff33d889-4c74-4b91-85ef-b4882cc8fe76" data-name="Rectangle 2" x="218.56201" y="516.11803" width="218.552" height="2.047" fill="#ccc"></rect><circle id="e8fa0310-b872-4adf-aedd-0c6eda09f3b8" data-name="Ellipse 3" cx="225.46401" cy="496.43702" r="6.902" fill="#6c63ff"></circle><path d="M660.69043,671.17188H591.62207a4.50493,4.50493,0,0,1-4.5-4.5v-24.208a4.50492,4.50492,0,0,1,4.5-4.5h69.06836a4.50491,4.50491,0,0,1,4.5,4.5v24.208A4.50492,4.50492,0,0,1,660.69043,671.17188Z" transform="translate(-227.576 -76.46149)" fill="#6c63ff"></path><circle id="e12ee00d-aa4a-4413-a013-11d20b7f97f7" data-name="Ellipse 7" cx="247.97799" cy="427.41999" r="6.902" fill="#6c63ff"></circle><circle id="f58f497e-6949-45c8-be5f-eee2aa0f6586" data-name="Ellipse 8" cx="270.492" cy="427.41999" r="6.902" fill="#6c63ff"></circle><circle id="b4d4939a-c6e6-4f4d-ba6c-e8b05485017d" data-name="Ellipse 9" cx="247.97799" cy="496.43702" r="6.902" fill="#6c63ff"></circle><circle id="aff120b1-519b-4e96-ac87-836aa55663de" data-name="Ellipse 10" cx="270.492" cy="496.43702" r="6.902" fill="#6c63ff"></circle><path id="f1094013-1297-477a-ac57-08eac07c4bd5-170" data-name="Path 88" d="M969.642,823.53851H251.656c-1.537,0-2.782-.546-2.782-1.218s1.245-1.219,2.782-1.219H969.642c1.536,0,2.782.546,2.782,1.219S971.178,823.53851,969.642,823.53851Z" transform="translate(-227.576 -76.46149)" fill="#3f3d56"></path><path d="M792.25256,565.92292a10.09371,10.09371,0,0,1,1.41075.78731l44.8523-19.14319,1.60093-11.81526,17.92157-.10956-1.05873,27.0982-59.19987,15.65584a10.60791,10.60791,0,0,1-.44749,1.20835,10.2346,10.2346,0,1,1-5.07946-13.68169Z" transform="translate(-227.576 -76.46149)" fill="#ffb8b8"></path><polygon points="636.98 735.021 624.72 735.021 618.888 687.733 636.982 687.734 636.98 735.021" fill="#ffb8b8"></polygon><path d="M615.96281,731.51778h23.64387a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H601.076a0,0,0,0,1,0,0v0A14.88686,14.88686,0,0,1,615.96281,731.51778Z" fill="#2f2e41"></path><polygon points="684.66 731.557 672.459 732.759 662.018 686.271 680.025 684.497 684.66 731.557" fill="#ffb8b8"></polygon><path d="M891.68576,806.12757h23.64387a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H876.7989a0,0,0,0,1,0,0v0A14.88686,14.88686,0,0,1,891.68576,806.12757Z" transform="translate(-303.00873 15.2906) rotate(-5.62529)" fill="#2f2e41"></path><circle cx="640.3925" cy="384.57375" r="24.56103" fill="#ffb8b8"></circle><path d="M849.55636,801.91945a4.47086,4.47086,0,0,1-4.415-3.69726c-6.34571-35.22559-27.08789-150.40528-27.584-153.59571a1.42684,1.42684,0,0,1-.01562-.22168v-8.58789a1.489,1.489,0,0,1,.27929-.87207l2.74024-3.83789a1.47845,1.47845,0,0,1,1.14355-.625c15.62207-.73242,66.78418-2.8789,69.25586.209h0c2.48242,3.10351,1.60547,12.50683,1.4043,14.36035l.00977.19336,22.98535,146.99512a4.51238,4.51238,0,0,1-3.71485,5.13476l-14.35644,2.36524a4.52127,4.52127,0,0,1-5.02539-3.09278c-4.44043-14.18847-19.3291-61.918-24.48926-80.38672a.49922.49922,0,0,0-.98047.13868c.25781,17.60546.88086,62.52343,1.0957,78.0371l.02344,1.6709a4.51811,4.51811,0,0,1-4.09277,4.53614l-13.84375,1.25781C849.83565,801.91359,849.695,801.91945,849.55636,801.91945Z" transform="translate(-227.576 -76.46149)" fill="#2f2e41"></path><path id="ae7af94f-88d7-4204-9f07-e3651de85c05-171" data-name="Path 99" d="M852.38089,495.2538c-4.28634,2.548-6.85116,7.23043-8.32276,11.9951a113.681,113.681,0,0,0-4.88444,27.15943l-1.55553,27.60021-19.25508,73.1699c16.68871,14.1207,26.31542,10.91153,48.78049-.63879s25.03222,3.85117,25.03222,3.85117l4.49236-62.25839,6.41837-68.03232a30.16418,30.16418,0,0,0-4.86143-4.67415,49.65848,49.65848,0,0,0-42.44229-8.99538Z" transform="translate(-227.576 -76.46149)" fill="#6c63ff"></path><path d="M846.12661,580.70047a10.52561,10.52561,0,0,1,1.50061.70389l44.34832-22.1972.736-12.02551,18.2938-1.26127.98041,27.4126L852.7199,592.93235a10.4958,10.4958,0,1,1-6.59329-12.23188Z" transform="translate(-227.576 -76.46149)" fill="#ffb8b8"></path><path id="a6768b0e-63d0-4b31-8462-9b2e0b00f0fd-172" data-name="Path 101" d="M902.76552,508.41151c10.91151,3.85117,12.83354,45.57369,12.83354,45.57369-12.8367-7.06036-28.24139,4.49318-28.24139,4.49318s-3.20916-10.91154-7.06034-25.03223a24.52987,24.52987,0,0,1,5.13436-23.10625S891.854,504.558,902.76552,508.41151Z" transform="translate(-227.576 -76.46149)" fill="#6c63ff"></path><path id="bfd7963f-0cf8-4885-9d3a-2c00bccda2e3-173" data-name="Path 102" d="M889.99122,467.53052c-3.06-2.44837-7.23517,2.00173-7.23517,2.00173l-2.4484-22.03349s-15.30095,1.8329-25.0935-.61161-11.32255,8.87513-11.32255,8.87513a78.57978,78.57978,0,0,1-.30582-13.77092c.61158-5.50838,8.56838-11.01675,22.6451-14.68932S887.6518,439.543,887.6518,439.543C897.44542,444.43877,893.05121,469.97891,889.99122,467.53052Z" transform="translate(-227.576 -76.46149)" fill="#2f2e41"></path></svg>
						{/* <img src={siva} alt="img" /> */}
						{/* <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img2.jpg" alt="" /> */}
					</div>
				</div>
			</div>
		</section>
	)
}



