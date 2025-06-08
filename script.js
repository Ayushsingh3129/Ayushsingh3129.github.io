// Wait for the HTML content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Live Stats Fetcher ---
    // Replace 'YOUR_BOT_ID_HERE' with AetherX's actual Discord User ID
    const botId = '1380938607115767850'; 
    const apiUrl = `https://top.gg/api/bots/${botId}`;

    // We need to use a proxy to get around CORS issues when fetching from a browser.
    // This is a free, public proxy that is fine for this simple task.
    const proxyUrl = `https://api.allorigins.win/get?url=`;

    fetch(proxyUrl + encodeURIComponent(apiUrl))
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // The actual JSON from top.gg is inside the 'contents' property
            const botData = JSON.parse(data.contents);
            
            // Update the server count on the website
            const serverCountElement = document.getElementById('server-count');
            if (serverCountElement && botData.server_count) {
                serverCountElement.textContent = botData.server_count.toLocaleString();
            }

            // Note: top.gg does not provide a reliable total user count.
            // We can estimate it or leave it as is. For now, we'll make an estimation.
            const userCountElement = document.getElementById('user-count');
             if (userCountElement && botData.server_count) {
                // A rough estimation of users.
                const estimatedUsers = botData.server_count * 150; 
                userCountElement.textContent = formatNumber(estimatedUsers);
            }
        })
        .catch(error => {
            console.error('Failed to fetch bot stats:', error);
            // If the fetch fails, we can just display a default value
            const serverCountElement = document.getElementById('server-count');
            if (serverCountElement) serverCountElement.textContent = '1,000';
            const userCountElement = document.getElementById('user-count');
            if (userCountElement) userCountElement.textContent = '150k';
        });

    // Helper function to format large numbers (e.g., 150000 -> 150k)
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'k';
        }
        return num;
    }
});