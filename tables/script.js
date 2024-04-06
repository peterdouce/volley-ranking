document.addEventListener("DOMContentLoaded", function() {
    const teamNameElem = document.getElementById('teamName');
    const teamInfoElem = document.getElementById('teamInfo');
    const teamPictureElem = document.getElementById('teamPicture');
    const rankingElem = document.getElementById('ranking');
    const gamesThisWeekHeadingElem = document.getElementById('gamesThisWeekHeading');
    const gamesBodyElem = document.getElementById('gamesBody');

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
        // Initialize index
        let index = 0;

        // Function to update content
        function updateContent(index) {
            const team = data[index];

            // Render team name and info
            teamNameElem.textContent = `${team.name}`;
            teamInfoElem.innerHTML = `${team.series}`;

            // Render team picture
            if (team.picture) {
                teamPictureElem.innerHTML = `<img src="${team.picture}" alt="${team.name}" class="img">`;
                rankingElem.innerHTML = '';

                // Hide ranking for the first 5 seconds if there is a picture
                setTimeout(() => {
                    teamPictureElem.innerHTML = '';
                    renderRanking(team);
                }, 5000);
            } else {
                renderRanking(team);
            }

            // Render gamesThisWeek
            const gamesThisWeek = team.gamesThisWeek;
            if (gamesThisWeek.length > 0) {
                gamesThisWeekHeadingElem.textContent = gamesThisWeek.length === 1 ? 'Wedstrijd deze week' : 'Wedstrijden deze week';
                renderGamesTable(gamesThisWeek);
            } else {
                gamesThisWeekHeadingElem.textContent = 'Geen';
                gamesBodyElem.innerHTML = '';
            }
        }

        // Function to render ranking
        function renderRanking(team) {
            if (team.showRanking) {
                const ranking = team.ranking.map((team, index) => `
                    <tr class="${index % 2 === 0 ? 'even-row' : ''} ${team.team.includes('Stevoort') ? 'roveka' : ''}">
                        <td>${team.rank}</td>
                        <td>${team.team}</td>
                        <td>${team.pts}</td>
                        <td>${team.games}</td>
                    </tr>
                `).join('');
                rankingElem.innerHTML = `
                    <h3>Ranking:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Ploeg</th>
                                <th>Ptn</th>
                                <th># Wed</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ranking}
                        </tbody>
                    </table>
                `;
            } else {
                rankingElem.innerHTML = '';
            }
        }

        // Function to render gamesThisWeek table
        function renderGamesTable(gamesThisWeek) {
            const gamesTable = gamesThisWeek.map(game => `
                <tr>
                    <td>${game.weekday}</td>
                    <td>${game.date}</td>
                    <td>${game.time}</td>
                    <td ${game.home.includes('Stevoort') ? 'class="roveka"' : ''}>${game.home}</td>
                    <td ${game.away.includes('Stevoort') ? 'class="roveka"' : ''}>${game.away}</td>
                    <td>${game.result}</td>
                </tr>
            `).join('');
            gamesBodyElem.innerHTML = gamesTable;
        }

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
