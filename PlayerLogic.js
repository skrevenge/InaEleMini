window.PlayerLogic = (function() {
    return class PlayerLogic {
        constructor() {
            if (!window.PlayerStatsData) {
                console.error('PlayerStatsData not loaded');
                return;
            }
            this.players = new Map();
            this.stats = new window.PlayerStats();
            this.statsOrder = ['TP', 'FP', 'shoot', 'strength', 'dribble', 'keeper', 'speed'];
            this.initializePlayers();
        }

        initializePlayers() {
            if (typeof PlayerStatsData !== 'undefined') {
                Object.values(PlayerStatsData).forEach(playerData => {
                    this.createPlayer(playerData);
                });
            } else {
                console.error('PlayerStatsData not loaded');
            }
        }

        createPlayer(playerData) {
            const player = {
                name: {
                    localized: playerData.name,
                    japanese: playerData.undubName
                },
                stats: this.createPlayerStats(playerData),
                sprites: {
                    portrait: playerData.portrait || '',
                    head: {
                        spritesheet: '',
                        frames: []
                    }
                }
            };
            this.players.set(player.name.japanese, player);
            return player;
        }

        createPlayerStats(data) {
            return {
                baseStats: {
                    TP: data.TP,
                    FP: data.FP,
                    element: data.element,
                    shoot: data.shoot,
                    strength: data.strength,
                    dribble: data.dribble,
                    keeper: data.keeper,
                    speed: data.speed
                },
                LvUpStatBoost: {
                    boost1: data.LvUpStatBoost?.boost1 || new Array(7).fill(0),
                    boost2: data.LvUpStatBoost?.boost2 || new Array(7).fill(0),
                    boost3: data.LvUpStatBoost?.boost3 || new Array(7).fill(0),
                    boost4: data.LvUpStatBoost?.boost4 || new Array(7).fill(0),
                    boost5: data.LvUpStatBoost?.boost5 || new Array(7).fill(0)
                },
                RankUpBoost: {
                    RankR: data.RankUpBoost?.RankR || new Array(7).fill(0),
                    RankSR: data.RankUpBoost?.RankSR || new Array(7).fill(0),
                    RankUR: data.RankUpBoost?.RankUR || new Array(7).fill(0),
                    RankLeg: data.RankUpBoost?.RankLeg || new Array(7).fill(0)
                },
                hissatsu: {
                    HissatsuRankN: data.HissatsuRankN || [],
                    HissatsuRankR: data.HissatsuRankR || [],
                    HissatsuRankSR: data.HissatsuRankSR || [],
                    HissatsuRankUR: data.HissatsuRankUR || [],
                    HissatsuRankLeg: data.HissatsuRankLeg || []
                }
            };
        }

        getLevelUpBoost(player, level) {
            const boostIndex = ((level - 1) % 5) + 1;
            return player.stats.LvUpStatBoost[`boost${boostIndex}`];
        }

        getPlayer(name) {
            return this.players.get(name);
        }

        getAllPlayers() {
            return Array.from(this.players.values());
        }
    }
})();

window.PlayerLogic = PlayerLogic;
