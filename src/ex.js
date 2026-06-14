const n = [
    { id: 1, reporter_id: 12, title: "..." },
    { id: 2, reporter_id: 12, title: "..." },
    { id: 3, reporter_id: 5, title: "..." },
    { id: 4, reporter_id: null, title: "..." },
];

const x = n.map((x) => x.title);
console.log(x);
