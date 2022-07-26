import React from 'react';

const UserContext=React.createContext({
    didRedirect:false,
    gameCreater:false,
    username:'',
    color:'white'
})

export default UserContext;