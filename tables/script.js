document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch JSON data
    function fetchDataAndRender() {
        fetch('teams.json')
            .then(response => response.json())
            .then(data => {
                renderContent(data);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Function to render content
    function renderContent(data) {
        // Get the content container
        const contentContainer = document.getElementById('content');

        // Function to update content
        function updateContent(index) {
            // Clear existing content
            contentContainer.innerHTML = '';

            // Create and append content
            const team = data[index];
            const content = document.createElement('div');
            content.innerHTML = `
                <h2>Team ${team.sequence}</h2>
                <p>Name: ${team.name}</p>
                <p>Series: ${team.series}</p>
            `;

            // Check if the team has a picture
            if (team.picture) {
                const picture = document.createElement('img');
                picture.src = team.picture;
                picture.alt = team.name;
                content.appendChild(picture);

                // Show picture for the first 5 seconds
                setTimeout(() => {
                    content.removeChild(picture);
                    // Check if the team should display ranking
                    if (team.showRanking) {
                        const ranking = document.createElement('div');
                        ranking.innerHTML = '<h3>Ranking:</h3>';
                        ranking.appendChild(renderRankingTable(team.ranking));
                        content.appendChild(ranking);
                    }
                }, 5000);
            } else {
                // If no picture, show ranking directly
                if (team.showRanking) {
                    const ranking = document.createElement('div');
                    ranking.innerHTML = '<h3>Ranking:</h3>';
                    ranking.appendChild(renderRankingTable(team.ranking));
                    content.appendChild(ranking);
                }
            }

            // Render gamesThisWeek in a table
            const gamesTable = document.createElement('table');
            gamesTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Dag</th>
                        <th>Datum</th>
                        <th>Uur</th>
                        <th>Thuis</th>
                        <th>Bezoekers</th>
                        <th>Uitslag</th>
                    </tr>
                </thead>
                <tbody>
                    ${team.gamesThisWeek.map(game => `
                        <tr>
                            <td>${game.weekday}</td>
                            <td>${game.date}</td>
                            <td>${game.time}</td>
                            <td ${game.home.includes('Stevoort') ? 'class="roveka"' : ''}>${game.home}</td>
                            <td ${game.away.includes('Stevoort') ? 'class="roveka"' : ''}>${game.away}</td>
                            <td>${game.result}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            content.appendChild(gamesTable);

            contentContainer.appendChild(content);
        }

        // Function to render ranking table
        function renderRankingTable(ranking) {
            const table = document.createElement('table');
            const headerRow = table.insertRow();
            const headers = ["#", "Ploeg", "Ptn", "# Wed"];
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            ranking.forEach((team, index) => {
                const row = table.insertRow();
                if (team.team.includes('Stevoort')) {
                    row.classList.add('roveka');
                }
                const cellNumber = row.insertCell(0);
                cellNumber.textContent = index + 1;
                const cellTeam = row.insertCell(1);
                cellTeam.textContent = team.team;
                const cellPoints = row.insertCell(2);
                cellPoints.textContent = team.pts;
                const cellGames = row.insertCell(3);
                cellGames.textContent = team.games;
            });
            return table;
        }

        // Initialize index
        let index = 0;

        // Initial update
        updateContent(index);

        // Loop over the array with a delay of 10 seconds
        const interval = setInterval(() => {
            index = (index + 1) % data.length;
            updateContent(index);

            // If reached the end of data, refresh data
            if (index === 0) {
                clearInterval(interval);
                fetchDataAndRender();
            }
        }, 10000);
    }

    // Initial fetch and render
    fetchDataAndRender();
});
