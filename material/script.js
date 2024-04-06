document.addEventListener("DOMContentLoaded", function() {
    const elements = {
        teamName: document.getElementById('teamName'),
        teamInfo: document.getElementById('teamInfo'),
        teamPicture: document.getElementById('teamPicture'),
        ranking: document.getElementById('ranking'),
        gamesThisWeekHeading: document.getElementById('gamesThisWeekHeading'),
        gamesBody: document.getElementById('gamesBody')
    };

    function fetchDataAndRender() {
        fetchTeams()
            .then(data => renderContent(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    async function fetchTeams() {
        const response = await fetch('teams.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    }

    function renderContent(data) {
        let index = 0;

        function updateContent(index) {
            const team = data[index];
            renderTeamInfo(team);
            renderRanking(team);
            renderGamesThisWeek(team);
        }

        function renderTeamInfo(team) {
            elements.teamName.textContent = team.name;
            elements.teamInfo.innerHTML = team.series;
            if (team.picture) {
                renderTeamPicture(team);
            } else {
                elements.teamPicture.innerHTML = '';
            }
        }

        function renderTeamPicture(team) {
            elements.teamPicture.innerHTML = `<img src="${team.picture}" alt="${team.name}">`;
            setTimeout(() => {
                elements.teamPicture.innerHTML = '';
                renderRanking(team);
            }, 5000);
        }

        function renderRanking(team) {
            if (team.showRanking) {
                const rankingHTML = generateRankingHTML(team.ranking);
                elements.ranking.innerHTML = `
                    <h3>Ranking:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ploeg</th>
                                <th>Ptn</th>
                                <th># Wed</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rankingHTML}
                        </tbody>
                    </table>
                `;
            } else {
                elements.ranking.innerHTML = '';
            }
        }

        function generateRankingHTML(rankingData) {
            return rankingData.map((team, index) => `
                <tr class="${index % 2 === 0 && !team.team.includes('Stevoort') ? 'even-row' : ''} ${team.team.includes('Stevoort') ? 'roveka' : ''}">
                    <td>${team.rank}</td>
                    <td>${team.team}</td>
                    <td>${team.pts}</td>
                    <td>${team.games}</td>
                </tr>
            `).join('');
        }

        function renderGamesThisWeek(team) {
            const gamesThisWeek = team.gamesThisWeek;
            if (gamesThisWeek.length > 0) {
                elements.gamesThisWeekHeading.textContent = gamesThisWeek.length === 1 ? 'Wedstrijd deze week' : 'Wedstrijden deze week';
                renderGamesTable(gamesThisWeek);
            } else {
                elements.gamesThisWeekHeading.textContent = 'Geen';
                elements.gamesBody.innerHTML = '';
            }
        }

        function renderGamesTable(gamesData) {
            const gamesTableHTML = gamesData.map(game => `
                <tr>
                    <td>${game.weekday}</td>
                    <td>${game.date}</td>
                    <td>${game.time}</td>
                    <td ${game.home.includes('Stevoort') ? 'class="roveka"' : ''}>${game.home}</td>
                    <td ${game.away.includes('Stevoort') ? 'class="roveka"' : ''}>${game.away}</td>
                    <td>${game.result}</td>
                </tr>
            `).join('');
            elements.gamesBody.innerHTML = `
                <table class="table" id="gamesTable">
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
                        ${gamesTableHTML}
                    </tbody>
                </table>
            `;
        }

        updateContent(index);

        const interval = setInterval(() => {
            index = (index + 1) % data.length;
            updateContent(index);
            if (index === 0) {
                clearInterval(interval);
                fetchDataAndRender();
            }
        }, 10000);
    }

    fetchDataAndRender();
});
