const users = [
    {
        id: 0,
        user: "admin",
        pass: "admin",
        firstname: "administratorius",
        lastname: "pagrindinis",
        role: "admin",
        projects: []
    },
    {
        id: 1,
        user: "aurimas",
        pass: "user",
        firstname: "Aurimas",
        lastname: "Arlauskas",
        role: "user",
        team: "InfomediaTheBest",
        projects: []
    },
    {
        id: 2,
        user: "greta",
        pass: "user",
        firstname: "Greta",
        lastname: "Kazkokia",
        role: "user",
        team: "We_Do_Love_Calls",
        projects: ["Vilniaus Vandenys", "MTTC", "TEST CASE SCENARIO"]
    },
    {
        id: 3,
        user: "client",
        pass: "client",
        firstname: "Vilniaus",
        lastname: "Vandenys",
        role: "client",
        projects: []
    }
]

export default users;