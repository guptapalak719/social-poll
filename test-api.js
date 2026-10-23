
async function testAPI() {
    const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
    name: "Palak"
})
    });

    const data = await response.json();
    console.log(data);
}

testAPI();
