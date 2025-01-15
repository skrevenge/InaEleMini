class PreloadScene extends BaseScene {
    constructor() {
        super({
            key: 'PreloadScene'
        });
    }
    preload() {
        // Criar barra de progresso
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Texto de loading
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        // Event Listeners para progresso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load IntroScene assets
        this.load.image('background', 'https://play.rosebud.ai/assets/art.png?qQpN');
        this.load.spritesheet('introIcons',
            'https://play.rosebud.ai/assets/IntroIcons242x188.png?JeT8', {
                frameWidth: 242,
                frameHeight: 188
            }
        );

        // Carregar todos os assets aqui
        super.preload(); // Carrega assets base (fonte)
        // Assets do Menu Principal
        this.load.image('poster', 'https://play.rosebud.ai/assets/Poster.png?Wbzx');
        this.load.image('logo', 'https://play.rosebud.ai/assets/InaMiniLogo.png?huyp');
        this.load.image('commonBar', 'https://play.rosebud.ai/assets/CommonBar.png?tfw5');
        this.load.audio('menuMusic', 'https://play.rosebud.ai/assets/IEOSTMenu.mp3?IhVv');
        this.load.audio('clickSound', 'https://play.rosebud.ai/assets/clickSFX.mp3?65xz');
        // Load player scripts
        if (typeof PlayerStatsData === 'undefined') {
            console.log('Loading PlayerStats...');
            this.load.script('playerStats', 'https://raw.githubusercontent.com/skrevenge/InaEleMini/refs/heads/main/PlayerStats.js');
        }
        if (typeof PlayerLogic === 'undefined') {
            console.log('Loading PlayerLogic...');
            this.load.script('playerLogic', 'https://raw.githubusercontent.com/skrevenge/InaEleMini/refs/heads/main/PlayerLogic.js');
        }
        // Add load complete handler
        this.load.on('complete', () => {
            try {
                // Check if PlayerStatsData is available
                if (typeof PlayerStatsData === 'undefined') {
                    console.error('PlayerStatsData not loaded properly');
                    return;
                } else {
                    console.log('PlayerStatsData loaded successfully!');
                }
                // Check if PlayerLogic is available
                if (typeof PlayerLogic === 'undefined') {
                    console.error('PlayerLogic not loaded properly');
                    return;
                } else {
                    console.log('PlayerLogic loaded successfully!');
                }
                // Initialize PlayerLogic
                this.playerLogic = new PlayerLogic();
                console.log('PlayerLogic initialized successfully');
            } catch (error) {
                console.error('Error initializing game:', error);
            }
        });
    }
    create() {
        this.scene.start('IntroScene');
    }
}
