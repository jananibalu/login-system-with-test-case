    import { Field, Form, Formik } from "formik";
    import { Eye, EyeOff } from "lucide-react";
    import { useState } from "react";
    import { useDispatch } from "react-redux";
    import * as Yup from "yup"
    import { login } from "../../redux/auth/authSlice";
    import { useNavigate } from "react-router-dom";
    import Cookies from "js-cookie";


    export default function Login() {

        const LoginSchema = Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Email is Required'),
            password: Yup.string()
                .min(2, 'Password must be at least 8 characters')
                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .matches(/\d/, 'Password must contain at least one number')
                .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
                .required('Password is required'),
        });

        const [showPassword, setShowPassword] = useState(false);
        const dispatch = useDispatch();
        const [error, setError] = useState();
        const navigate = useNavigate();

        const handleSubmit = async (values: any) => {
            try {
                const result = await dispatch<any>(login(values)).unwrap();
                console.log(result)
                const data = result?.data
                if (data.accessToken && data?.role) {
                    Cookies.set("token", data.accessToken)
                    Cookies.set("role", data.role)

                    navigate('/home')
                }
            }
            catch (errors) {
                setError(errors)
            }
        }

        return (
            <div className='container'>
                <div className='row'>
                    <div className='card w-100 rounded shadow-md p-0'>
                        <div className='card-body'>
                            <h2 className="my-4">Login</h2>
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                }}
                                validationSchema={LoginSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched, values }) => (
                                    <Form>
                                        <Field name="email" type="email"
                                            className={`form-control my-2 ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Enter your email" />
                                        {errors.email && touched.email ? <div className="invalid-feedback">{errors.email}</div> : null}

                                        <div className="position-relative">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className={`form-control mt-4 ${touched.password && errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Enter your password"
                                                style={{ paddingRight: "60px" }}
                                            />
                                            {values.password.length > 0 && (
                                                <div
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="position-absolute"
                                                    style={{
                                                        top: "50%",
                                                        right: touched.password && errors.password ? "40px" : "15px",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                        zIndex: 10
                                                    }}
                                                >
                                                    {showPassword ? <Eye /> : <EyeOff />}
                                                </div>
                                            )}
                                        </div>

                                        {error && <div className="bg-danger-subtle text-danger p-2 rounded my-3">{error}</div>}
                                        {errors.password && touched.password ? <div className="invalid-feedback my-2">{errors.password}</div> : null}
                                        <button type="submit" className="btn btn-danger mt-4">Submit</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
