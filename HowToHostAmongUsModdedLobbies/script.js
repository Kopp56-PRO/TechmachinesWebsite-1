document.addEventListener('DOMContentLoaded', () => {
    const parsecBtn = document.getElementById('parsec-btn');
    const teamviewerBtn = document.getElementById('teamviewer-btn');
    const anydeskBtn = document.getElementById('anydesk-btn');
    const content = document.getElementById('content');

    parsecBtn.addEventListener('click', () => {
        content.innerHTML = '<p>Coming soon</p>';
    });

    teamviewerBtn.addEventListener('click', () => {
        content.innerHTML = `
            <p>First, install TeamViewer Remote Control app on your phone (Available on Play Store, App Store, etc.)</p>
            <button id="teamviewer-next-1" class="primary-btn">Next</button>
        `;
        document.getElementById('teamviewer-next-1').addEventListener('click', () => {
            content.innerHTML = `
                <p>Then, put the following ID<br>ID: 188 318 067</p>
                <button id="teamviewer-next-2" class="primary-btn">Next</button>
            `;
            document.getElementById('teamviewer-next-2').addEventListener('click', () => {
                content.innerHTML = `
                    <p>Then, put the following password<br>Password: Vs6e@jp.tnTrP7/DecFx8TQg</p>
                    <button id="teamviewer-next-3" class="primary-btn">Next</button>
                `;
                document.getElementById('teamviewer-next-3').addEventListener('click', () => {
                    content.innerHTML = '<p>Now just create your Among Us modded lobby!</p>';
                });
            });
        });
    });

    anydeskBtn.addEventListener('click', () => {
        content.innerHTML = `
            <p>Download Anydesk app on your phone (Available on Play Store, App Store, etc.)</p>
            <button id="anydesk-next-1" class="primary-btn">Next</button>
        `;
        document.getElementById('anydesk-next-1').addEventListener('click', () => {
            content.innerHTML = `
                <p>After installing, click open and go to <b>Enter remote address</b> and put the following address<br>Address: 1 967 688 212</p>
                <button id="anydesk-next-2" class="primary-btn">Next</button>
            `;
            document.getElementById('anydesk-next-2').addEventListener('click', () => {
                content.innerHTML = `
                    <p>When it asks for a password, enter the following password<br>Password: FJS9RUCUHyTeLiEXSdDivcezz4fnJNaCSUs3sSULwFdhpIseCTdD</p>
                    <button id="anydesk-next-3" class="primary-btn">Next</button>
                `;
                document.getElementById('anydesk-next-3').addEventListener('click', () => {
                    content.innerHTML = '<p>Now just create your Among Us modded lobby!</p>';
                });
            });
        });
    });
});
