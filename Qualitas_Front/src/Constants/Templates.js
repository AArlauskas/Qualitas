const templates = [
    {
        id: 0,
        name: "Example Template",
        topics: [
            {
                id: 0,
                name: "Not understanding the topic",
                critical: true,
            },
            {
                id: 1,
                name: "Calling names",
                critical: true,
            },
            {
                id: 2,
                name: "Asking the right questions",
                critical: false,
            },
            {
                id: 3,
                name: "Some kind of topic",
                critical: false,
            }
        ],
        criteria: [
            {
                id: 0,
                name: "Test criteria 1",
                points: 2,
                parentId: 2
            },
            {
                id: 1,
                name: "Test criteria 2",
                points: 3,
                parentId: 2
            },
            {
                id: 2,
                name: "Test criteria 1",
                points: 7,
                parentId: 3
            },
        ]
    },
    {
        id: 1,
        name: "Example Template 2",
        topics: [
            {
                id: 0,
                name: "Not understanding the topic",
                critical: true,
            },
            {
                id: 1,
                name: "Calling names",
                critical: true,
            },
            {
                id: 2,
                name: "Asking the right questions",
                critical: false,
            },
            {
                id: 3,
                name: "Some kind of topic",
                critical: false,
            }
        ],
        criteria: [
            {
                id: 0,
                name: "Test criteria 1",
                points: 2,
                parentId: 2
            },
            {
                id: 1,
                name: "Test criteria 2",
                points: 3,
                parentId: 2
            },
            {
                id: 2,
                name: "Test criteria 1",
                points: 7,
                parentId: 3
            },
        ]
    }
]

export default templates;