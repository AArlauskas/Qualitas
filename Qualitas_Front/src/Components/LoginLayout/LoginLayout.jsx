import React, { useState } from 'react';
import RTCLogo from "../../Images/QLogo.png";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Login } from '../../API/API';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Infomedia
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorIsShowing, setErrorIsShowing] = useState(false);

    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <img src={RTCLogo} alt="RTC_Logo" style={{ width: 400, height: 400 }} />
            </div>
            {loading ? <LoadingScreen /> :
                <div>
                    <div>
                        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={4000} open={errorIsShowing} onClose={() => setErrorIsShowing(false)}>
                            <MuiAlert elevation={6} variant="filled" severity="error">Failed to sign in</MuiAlert>
                        </Snackbar>
                    </div>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={username.length < 4 || password.length < 4}
                                    className={classes.submit}
                                    onClick={() => {
                                        setLoading(true);
                                        let data = {
                                            username: username,
                                            password: password
                                        };
                                        Login(data).then(response => {
                                            if (response === "notFound") {
                                                setLoading(false);
                                                setErrorIsShowing(true);
                                            }
                                            else {
                                                window.localStorage.setItem("username", response.username);
                                                window.localStorage.setItem("name", response.firstname + " " + response.lastname);
                                                window.localStorage.setItem("id", response.Id);
                                                window.localStorage.setItem("role", response.role);
                                                if (response.role === "client" && response.projectsCount === 0) {
                                                    window.localStorage.clear();
                                                    setLoading(false);
                                                    setErrorIsShowing(true);
                                                }
                                                window.location.reload(false);
                                            }
                                        });
                                    }}
                                >
                                    Sign In
          </Button>
                            </form>
                        </div>
                        <Box mt={8}>
                            <Copyright />
                        </Box>
                    </Container>
                </div>}
        </div>
    );
}