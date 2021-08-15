import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      backgroundColor: '#1a1c21',
      border: 0,
      color: '#e1e1e1',
      height: 78,
      width:'100%',
      padding: '0',
      display: 'flex',
      alignItems:'center',
      zIndex:0,
      position:'absolute'
    },
    h1:{
        color:'#e1e1e1',
        marginLeft:'30vh',
        fontSize:'3.5vh',
    },
    a:{
        textDecoration:'none',
        color:'#e1e1e1',
        fontSize:'1.9vh',
        margin:'3vh',
        padding:'1vh',
        fontFamily: 'Lato sans-serif',
        '&:hover':{
            borderBottom:'1px solid'
        }
    },
    nav:{
        display: 'flex',
        textDecoration:'none'
    },
    links:{
        display: 'flex',
        padding:'2vh',
        margin:'10%'
    }
  });

export default function AppBar(props){
    const classes = useStyles();
    return(
        <div className = {classes.root}>
            <h1 className={classes.h1}>SleepIdo</h1>
            <div className={classes.links}>
                <a className={classes.a} href="/store">Store</a>
                <a className={classes.a} href="/dashboard">Alarms</a>
            </div>
        </div>
    )
}