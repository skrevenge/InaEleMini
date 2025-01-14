export class IntroScene extends BaseScene {
    constructor() {
        super({
            key: 'IntroScene'
        });
        this.isAnimating = false; // Flag to track animation state
        this.originalGameplayY = 600; // Store original Y position
        this.shiftedGameplayY = 750; // Store shifted Y position for English
        this.hasMovedDown = false; // Flag to track if elements have been moved down
    }
    preload() {
        super.preload();
        this.load.image('background', 'https://play.rosebud.ai/assets/art.png?qQpN');
        this.load.spritesheet('introIcons',
            'https://play.rosebud.ai/assets/IntroIcons242x188.png?JeT8', {
                frameWidth: 242,
                frameHeight: 188
            }
        );
    }
    create() {
        // Call parent class create method
        if (super.create) {
            super.create();
        }

        // Add background
        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        // Create containers but set them initially invisible
        this.englishContainer = this.add.container(0, 0).setAlpha(0);
        this.portugueseContainer = this.add.container(0, 0).setAlpha(0);
        this.keyboardContainer = this.add.container(0, 0).setAlpha(0);
        this.touchscreenContainer = this.add.container(0, 0).setAlpha(0);
        // Create graphics for borders
        this.englishBorder = this.add.graphics().setAlpha(0);
        this.portugueseBorder = this.add.graphics().setAlpha(0);
        this.keyboardBorder = this.add.graphics().setAlpha(0);
        this.touchscreenBorder = this.add.graphics().setAlpha(0);

        // Initialize selection state
        this.languageSelected = false;
        this.dubSelected = null; // Track dub selection
        // Create name style text
        this.nameStyleText = this.add.bitmapText(
            this.cameras.main.centerX,
            580,
            'customFont',
            'Name Style',
            50
        ).setOrigin(0.5).setAlpha(0);
        // Create dub options containers (initially hidden)
        this.dubContainer = this.add.container(0, 0).setAlpha(0);
        this.undubContainer = this.add.container(0, 0).setAlpha(0);

        // Create dub options backgrounds
        this.dubBg = this.add.graphics();
        this.undubBg = this.add.graphics();
        this.drawDubBox(this.dubBg, this.cameras.main.centerX - 150, 650);
        this.drawDubBox(this.undubBg, this.cameras.main.centerX + 150, 650);

        // Create dub options text
        const dubText = this.add.bitmapText(
            this.cameras.main.centerX - 150,
            650,
            'customFont',
            'Dub Names',
            48
        ).setOrigin(0.5);

        const undubText = this.add.bitmapText(
            this.cameras.main.centerX + 150,
            650,
            'customFont',
            'Undub Names',
            48
        ).setOrigin(0.5);

        // Add elements to containers
        this.dubContainer.add([this.dubBg, dubText]);
        this.undubContainer.add([this.undubBg, undubText]);

        // Make dub options interactive
        this.dubBg.setInteractive(
            new Phaser.Geom.Rectangle(this.cameras.main.centerX - 270, 620, 240, 60),
            Phaser.Geom.Rectangle.Contains
        );
        this.undubBg.setInteractive(
            new Phaser.Geom.Rectangle(this.cameras.main.centerX + 30, 620, 240, 60),
            Phaser.Geom.Rectangle.Contains
        );

        // Add click handlers for dub options
        this.dubBg.on('pointerdown', () => this.selectDub('dub'));
        this.undubBg.on('pointerdown', () => this.selectDub('undub'));

        // Scale to cover the screen while maintaining aspect ratio
        const scaleX = this.cameras.main.width / background.width;
        const scaleY = this.cameras.main.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);
        // Create timeline for intro sequence
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: background,
                alpha: 0.5,
                duration: 500,
                onComplete: () => {
                    this.showOptions();
                }
            });
        });
        // Create all elements but set them initially invisible
        // Create all UI elements with initial alpha 0 except continue text
        this.titleText = this.add.bitmapText(
            this.cameras.main.centerX,
            200,
            'customFont',
            Localization.getText('english', 'title'),
            50
        ).setOrigin(0.5).setVisible(false);
        // Create English option
        const englishIcon = this.add.sprite(
            this.cameras.main.centerX - 150,
            380,
            'introIcons',
            0
        ).setInteractive();
        const englishText = this.add.bitmapText(
            this.cameras.main.centerX - 150,
            500,
            'customFont',
            Localization.getText('english', 'languageEn'),
            36
        ).setOrigin(0.5);
        this.englishContainer.add([englishIcon, englishText]);
        // Create Portuguese option
        const portugueseIcon = this.add.sprite(
            this.cameras.main.centerX + 150,
            380,
            'introIcons',
            1
        ).setInteractive();
        const portugueseText = this.add.bitmapText(
            this.cameras.main.centerX + 150,
            500,
            'customFont',
            Localization.getText('english', 'languagePt'),
            36
        ).setOrigin(0.5);
        this.portugueseContainer.add([portugueseIcon, portugueseText]);
        // Add Gameplay Style text
        this.gameplayStyleText = this.add.bitmapText(
            this.cameras.main.centerX,
            600,
            'customFont',
            Localization.getText('english', 'gameplayStyle'),
            50
        ).setOrigin(0.5).setAlpha(0);
        // Create Keyboard/Mouse option
        const keyboardIcon = this.add.sprite(
            this.cameras.main.centerX - 150,
            730,
            'introIcons',
            2
        ).setInteractive();
        this.keyboardText = this.add.bitmapText(
            this.cameras.main.centerX - 150,
            850,
            'customFont',
            Localization.getText('english', 'keyboard'),
            36
        ).setOrigin(0.5);
        this.keyboardContainer.add([keyboardIcon, this.keyboardText]);
        // Create Touchscreen option
        const touchscreenIcon = this.add.sprite(
            this.cameras.main.centerX + 150,
            730,
            'introIcons',
            3
        ).setInteractive();
        this.touchscreenText = this.add.bitmapText(
            this.cameras.main.centerX + 150,
            850,
            'customFont',
            Localization.getText('english', 'touchscreen'),
            36
        ).setOrigin(0.5);
        this.touchscreenContainer.add([touchscreenIcon, this.touchscreenText]);
        // Add interaction handlers for gameplay style
        keyboardIcon.on('pointerdown', () => {
            this.selectGameplayStyle('keyboard');
        });
        touchscreenIcon.on('pointerdown', () => {
            this.selectGameplayStyle('touchscreen');
        });
        // Add interaction handlers
        englishIcon.on('pointerdown', () => {
            this.selectLanguage('english');
        });
        portugueseIcon.on('pointerdown', () => {
            this.selectLanguage('portuguese');
        });
        // Add continue button
        // Create continue button with rounded rectangle background
        this.continueBg = this.add.graphics();
        this.continueBg.fillStyle(0x000000, 0.5);
        this.continueBg.lineStyle(2, 0xFFFFFF, 1);
        this.continueBg.fillRoundedRect(this.cameras.main.centerX - 120, this.cameras.main.height - 230, 240, 60, 15);
        this.continueBg.strokeRoundedRect(this.cameras.main.centerX - 120, this.cameras.main.height - 230, 240, 60, 15);
        this.continueBg.setAlpha(0);
        this.continueBg.setInteractive(
            new Phaser.Geom.Rectangle(this.cameras.main.centerX - 120, this.cameras.main.height - 230, 240, 60),
            Phaser.Geom.Rectangle.Contains
        );

        const continueText = this.add.bitmapText(
            this.cameras.main.centerX,
            this.cameras.main.height - 200,
            'customFont',
            Localization.getText('english', 'continue'),
            48
        ).setOrigin(0.5).setAlpha(0);
        this.continueText = continueText;
        // Make background interactive with hand cursor
        this.continueBg.setInteractive({
            useHandCursor: true
        });
        // Disable continue button initially
        this.continueBg.input.enabled = false;
        const handleContinueClick = () => {
            if (this.languageSelected) {
                // Atualizar configurações globais
                this.gameSettings.language = this.currentLanguage;
                this.gameSettings.gameplayStyle = this.gameplayStyleSelected;
                this.gameSettings.nameStyle = this.currentLanguage === 'portuguese' ? 'undub' : this.dubSelected;

                // Transição simples para o menu principal
                this.scene.start('MainMenu');
            }
        };
        this.continueBg.on('pointerdown', handleContinueClick);
        // Start border animation
        this.borderAlpha = 1;
        this.borderFadeOut = true;

        // Add update loop for border animation
        this.time.addEvent({
            delay: 50,
            callback: this.updateBorders,
            callbackScope: this,
            loop: true
        });
    }
    showOptions() {
        // Set initial alpha for all UI elements
        [
            this.titleText,
            this.englishContainer,
            this.portugueseContainer,
            this.keyboardContainer,
            this.touchscreenContainer,
            this.gameplayStyleText,
            this.continueBg,
            this.englishBorder,
            this.portugueseBorder,
            this.keyboardBorder,
            this.touchscreenBorder
        ].forEach(element => {
            if (element) element.setAlpha(0);
        });
        // Keep continue text hidden initially
        if (this.continueText) {
            this.continueText.setAlpha(0);
        }
        // Set continue text to low opacity immediately with the continue bg
        if (this.continueText) {
            this.continueText.setAlpha(0);
        }
        // Create a sequence to fade in elements
        const timeline = this.tweens.createTimeline();

        // Make title visible and fade it in first
        timeline.add({
            targets: [this.titleText],
            alpha: {
                from: 0,
                to: 1
            },
            duration: 500,
            onStart: () => {
                this.titleText.setVisible(true);
            }
        });
        // Fade in language options and their borders
        timeline.add({
            targets: [
                this.englishContainer,
                this.portugueseContainer,
                this.englishBorder,
                this.portugueseBorder
            ],
            alpha: 1,
            duration: 500,
            offset: 200
        });
        // Fade in gameplay style options and their borders
        timeline.add({
            targets: [
                this.gameplayStyleText,
                this.keyboardContainer,
                this.touchscreenContainer,
                this.keyboardBorder,
                this.touchscreenBorder,
                this.continueBg,
                this.continueText
            ],
            alpha: {
                from: 0,
                to: (targets) => {
                    // Set specific alpha for continue text
                    return targets === this.continueText ? 0.5 : 1;
                }
            },
            duration: 500,
            offset: 200
        });
        timeline.play();
    }
    selectLanguage(language) {
        if (this.isAnimating) return; // Prevent language switch during animation
        this.languageSelected = true;
        this.currentLanguage = language;
        if (language === 'english') {
            // Reset English container to full opacity and add border
            this.englishContainer.setAlpha(1);
            this.drawBorder(this.englishBorder, this.cameras.main.centerX - 150, 380, 1);

            // Fade out Portuguese option and remove its border
            this.portugueseContainer.setAlpha(0.3);
            this.portugueseBorder.clear();
        } else {
            // Reset Portuguese container to full opacity and add border
            this.portugueseContainer.setAlpha(1);
            this.drawBorder(this.portugueseBorder, this.cameras.main.centerX + 150, 380, 1);

            // Fade out English option and remove its border
            this.englishContainer.setAlpha(0.3);
            this.englishBorder.clear();
        }
        if (language === 'english') {
            if (!this.hasMovedDown) {
                this.isAnimating = true;
                this.hasMovedDown = true;
                // Initially set dub options and name style text to invisible
                this.dubContainer.setAlpha(0);
                this.undubContainer.setAlpha(0);
                this.nameStyleText.setAlpha(0);

                // Move gameplay style elements down
                this.tweens.add({
                    targets: [
                        this.gameplayStyleText,
                        this.keyboardContainer,
                        this.touchscreenContainer,
                        this.keyboardBorder,
                        this.touchscreenBorder
                    ],
                    y: `+=${this.shiftedGameplayY - this.originalGameplayY}`,
                    duration: 500,
                    onComplete: () => {
                        // After elements have moved, fade in the dub options
                        this.tweens.add({
                            targets: [this.dubContainer, this.undubContainer, this.nameStyleText],
                            alpha: 1,
                            duration: 300,
                            onComplete: () => {
                                this.isAnimating = false;
                            }
                        });
                    }
                });
            } else {
                // If already moved down, just ensure dub options are visible
                this.dubContainer.setAlpha(1);
                this.undubContainer.setAlpha(1);
                this.nameStyleText.setAlpha(1);
            }
        } else {
            // Hide dub options and name style text immediately
            this.dubContainer.setAlpha(0);
            this.undubContainer.setAlpha(0);
            this.nameStyleText.setAlpha(0);
            this.dubSelected = null;
            // Move gameplay style elements back up
            if (this.hasMovedDown) {
                this.hasMovedDown = false;
                this.isAnimating = true;
                this.tweens.add({
                    targets: [
                        this.gameplayStyleText,
                        this.keyboardContainer,
                        this.touchscreenContainer,
                        this.keyboardBorder,
                        this.touchscreenBorder
                    ],
                    y: `-=${this.shiftedGameplayY - this.originalGameplayY}`,
                    duration: 500,
                    onComplete: () => {
                        this.isAnimating = false;
                    }
                });
            }
        }
        // Activate continue button
        this.continueText.setAlpha(1);
        // Update text based on selected language
        // Update all texts based on selected language
        this.gameplayStyleText.setText(Localization.getText(language, 'gameplayStyle'));
        this.keyboardText.setText(Localization.getText(language, 'keyboard'));
        this.touchscreenText.setText(Localization.getText(language, 'touchscreen'));
        this.continueText.setText(Localization.getText(language, 'continue'));
        // Keep gameplay style selection when switching languages
        this.updateContinueButton();
    }
    selectGameplayStyle(style) {
        this.gameplayStyleSelected = style;
        if (style === 'keyboard') {
            // Reset keyboard container to full opacity and add border
            this.keyboardContainer.setAlpha(1);
            this.drawBorder(this.keyboardBorder, this.cameras.main.centerX - 150, 730, 1);
            // Fade out touchscreen option and remove its border
            this.touchscreenContainer.setAlpha(0.3);
            this.touchscreenBorder.clear();
        } else {
            // Reset touchscreen container to full opacity and add border
            this.touchscreenContainer.setAlpha(1);
            this.drawBorder(this.touchscreenBorder, this.cameras.main.centerX + 150, 730, 1);
            // Fade out keyboard option and remove its border
            this.keyboardContainer.setAlpha(0.3);
            this.keyboardBorder.clear();
        }
        this.updateContinueButton();
    }
    updateBorders() {
        if (!this.languageSelected) {
            // Update border alpha for animation
            if (this.borderFadeOut) {
                this.borderAlpha -= 0.05;
                if (this.borderAlpha <= 0.2) {
                    this.borderFadeOut = false;
                }
            } else {
                this.borderAlpha += 0.05;
                if (this.borderAlpha >= 1) {
                    this.borderFadeOut = true;
                }
            }
            // Draw borders with current alpha
            // Draw language option borders
            this.drawBorder(this.englishBorder, this.cameras.main.centerX - 150, 380, this.borderAlpha);
            this.drawBorder(this.portugueseBorder, this.cameras.main.centerX + 150, 380, this.borderAlpha);

            // Draw gameplay style borders
            this.drawBorder(this.keyboardBorder, this.cameras.main.centerX - 150, 730, this.borderAlpha);
            this.drawBorder(this.touchscreenBorder, this.cameras.main.centerX + 150, 730, this.borderAlpha);
        }
    }
    drawBorder(graphics, x, y, alpha) {
        graphics.clear();
        graphics.lineStyle(3, 0xFFFFFF, alpha);
        graphics.strokeRect(x - 121, y - 94, 242, 188);
    }
    drawDubBox(graphics, x, y) {
        graphics.clear();
        graphics.fillStyle(0x000000, 0.5);
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.fillRoundedRect(x - 120, y - 30, 240, 60, 15);
        graphics.strokeRoundedRect(x - 120, y - 30, 240, 60, 15);
    }
    selectDub(type) {
        if (this.dubSelected === type) return;

        this.dubSelected = type;
        if (type === 'dub') {
            this.dubContainer.setAlpha(1);
            this.undubContainer.setAlpha(0.3);
        } else {
            this.dubContainer.setAlpha(0.3);
            this.undubContainer.setAlpha(1);
        }
    }
    updateContinueButton() {
        let canContinue = false;

        // Basic requirements for both languages
        let hasBasicRequirements = this.languageSelected &&
            this.gameplayStyleSelected !== undefined;

        if (this.currentLanguage === 'english') {
            // For English, also need name style selection
            canContinue = hasBasicRequirements && this.dubSelected !== null;
        } else {
            // For Portuguese, only need basic requirements
            canContinue = hasBasicRequirements;
        }

        // Update continue button state
        const alpha = canContinue ? 1 : 0.5;
        this.continueText.setAlpha(alpha);
        this.continueBg.setAlpha(alpha);
        this.continueBg.input.enabled = canContinue;
    }
}
