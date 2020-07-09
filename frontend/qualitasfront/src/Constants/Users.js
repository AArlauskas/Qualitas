const users = [
    {
        id: 0,
        user: "admin",
        pass: "admin",
        firstname: "administratorius",
        lastname: "pagrindinis",
        role: "admin",
        projects: [],
        archived: false
    },
    {
        id: 1,
        user: "aurimas",
        pass: "user",
        firstname: "Aurimas",
        lastname: "Arlauskas",
        role: "user",
        team: "InfomediaTheBest",
        projects: [], archived: false
    },
    {
        id: 2,
        user: "greta",
        pass: "user",
        firstname: "Greta",
        lastname: "Kazkokia",
        role: "user",
        team: "We_Do_Love_Calls",
        projects: ["Vilniaus Vandenys", "MTTC", "TEST CASE SCENARIO"],
        archived: false
    },
    {
        id: 3,
        user: "client",
        pass: "client",
        firstname: "Vilniaus",
        lastname: "Vandenys",
        role: "client",
        projects: [],
        archived: false
    },
    {
        id: 4,
        user: "archived_client",
        pass: "archived_client",
        firstname: "Archived",
        lastname: "Client type",
        role: "client",
        projects: [],
        archived: true
    },
    {
        id: 5,
        user: "archived_user",
        pass: "archived_user",
        firstname: "Archived",
        lastname: "User type",
        role: "user",
        projects: ["MTTC"],
        archived: true
    }
]

export default users;