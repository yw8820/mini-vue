export const game = new PIXI.Application({
  width: 500,
  height: 500,
})

document.body.append(game.view)
export const createRootContainer = () => {
  return game.stage
};

