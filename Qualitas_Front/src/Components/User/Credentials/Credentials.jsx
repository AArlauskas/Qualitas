import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

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

export default function Credentials(props) {
    const classes = useStyles();
    const [username, setUsername] = useState(props.user.username);
    const [password, setPassword] = useState(props.user.password);
    const [errorIsShowing, setErrorIsShowing] = useState(false);

    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <h2>Credentials:</h2>
                <h3>Role: {window.localStorage.getItem("role")}</h3>
                <h3>Name: {window.localStorage.getItem("name")}</h3>
            </div>
            <div>
                {console.log(props)}
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
                                    let data = {
                                        username: username,
                                        password: password
                                    };
                                    props.updateCredentials(data);
                                    setTimeout(() => {
                                        window.localStorage.clear();
                                        window.location.href = "/";
                                    }, 1500)
                                }}
                            >
                                Save
                                </Button>
                        </form>
                    </div>
                </Container>
            </div>
        </div>
    );
}