/**
 * Function calculating user's new level and XP. 
 * The formula itself can be anything you want, just make
 * sure the function returns `{ level, xp }`.
 * @param level user's currrent level.
 * @param xp user's current XP.
 * @returns returns new level and new XP as `{ level, xp }`.
 */
function formula(level: number, xp: number) {
    
    xp += Math.floor(random(Math.sqrt(level + 1) * 10, Math.sqrt(level + 1) * 25));
    if (xp > 100 * (level + 1)) {
        level += 1;
        xp = xp - ((level) * 100);
    }

    return { level: Math.floor(level), xp: Math.floor(xp) };
}

/**
 * Helper `random()` function, used in `formula()`. 
 * You are not required to use this function in your own formula, 
 * just make sure everything works as intended.
 * Can be exported if there's a need to, just use `{ formula, random }` instead of `formula` at the bottom. 
 * Don't forget to change it wherever it's imported.
 * @param min minimum number
 * @param max maximum number
 * @returns pseudorandom number between `min` and `max`
 */
function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default formula;