document.addEventListener('DOMContentLoaded', () => {
    const abilityScores = {
        str: document.getElementById('strScore'),
        dex: document.getElementById('dexScore'),
        con: document.getElementById('conScore'),
        int: document.getElementById('intScore'),
        wis: document.getElementById('wisScore'),
        cha: document.getElementById('chaScore')
    };

    const abilityModifiers = {
        str: document.getElementById('strMod'),
        dex: document.getElementById('dexMod'),
        con: document.getElementById('conMod'),
        int: document.getElementById('intMod'),
        wis: document.getElementById('wisMod'),
        cha: document.getElementById('chaMod')
    };

    const initiativeMod = document.getElementById('initiative');
    const skillsList = document.getElementById('skills-list');

    const skills = [
        // STR
        { name: 'Atletyka', ability: 'str' },
        // DEX
        { name: 'Akrobatyka', ability: 'dex' },
        { name: 'Zwinne dłonie', ability: 'dex' },
        { name: 'Skradanie się', ability: 'dex' },
        // INT
        { name: 'Arcana', ability: 'int' },
        { name: 'Historia', ability: 'int' },
        { name: 'Badanie', ability: 'int' },
        { name: 'Natura', ability: 'int' },
        { name: 'Religia', ability: 'int' },
        // WIS
        { name: 'Opieka nad zwierzętami', ability: 'wis' },
        { name: 'Wgląd', ability: 'wis' },
        { name: 'Medycyna', ability: 'wis' },
        { name: 'Percepcja', ability: 'wis' },
        { name: 'Przetrwanie', ability: 'wis' },
        // CHA
        { name: 'Oszustwo', ability: 'cha' },
        { name: 'Zastraszanie', ability: 'cha' },
        { name: 'Występy', ability: 'cha' },
        { name: 'Perswazja', ability: 'cha' }
    ];

    function calculateModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    function updateAbilityScores() {
        for (const ability in abilityScores) {
            const score = parseInt(abilityScores[ability].value);
            const modifier = calculateModifier(score);
            abilityModifiers[ability].textContent = `Mod: ${modifier >= 0 ? '+' : ''}${modifier}`;
        }
        updateInitiative();
        updateSkills();
    }

    function updateInitiative() {
        const dexScore = parseInt(abilityScores.dex.value);
        const dexModifier = calculateModifier(dexScore);
        initiativeMod.textContent = `${dexModifier >= 0 ? '+' : ''}${dexModifier}`;
    }

    function generateSkills() {
        skillsList.innerHTML = ''; // Wyczyść listę przed wygenerowaniem
        skills.sort((a, b) => a.name.localeCompare(b.name)).forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `skill-${skill.name.toLowerCase().replace(/\s/g, '-')}`;
            checkbox.dataset.ability = skill.ability; // Zapisz zdolność bazową

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = skill.name;

            const modifierSpan = document.createElement('span');
            modifierSpan.classList.add('skill-modifier');
            modifierSpan.id = `mod-${skill.name.toLowerCase().replace(/\s/g, '-')}`;
            modifierSpan.textContent = '+0'; // Domyślny modyfikator

            skillDiv.appendChild(checkbox);
            skillDiv.appendChild(label);
            skillDiv.appendChild(modifierSpan);
            skillsList.appendChild(skillDiv);

            // Dodaj event listener do checkboxa, żeby zaznaczenie wpływało na modyfikator
            checkbox.addEventListener('change', updateSkills);
        });
    }

    function updateSkills() {
        const proficiencyBonus = calculateProficiencyBonus(parseInt(document.getElementById('charLevel').value)); // Zakładamy, że level jest aktualny
        
        document.querySelectorAll('.skill-item input[type="checkbox"]').forEach(checkbox => {
            const skillName = checkbox.id.replace('skill-', '').replace(/-/g, ' ');
            const ability = checkbox.dataset.ability;
            const abilityScore = parseInt(abilityScores[ability].value);
            let skillModifier = calculateModifier(abilityScore);

            if (checkbox.checked) {
                skillModifier += proficiencyBonus;
            }

            const modifierSpan = document.getElementById(`mod-${skillName.replace(/\s/g, '-')}`);
            modifierSpan.textContent = `${skillModifier >= 0 ? '+' : ''}${skillModifier}`;
        });
    }

    function calculateProficiencyBonus(level) {
        if (level >= 1 && level <= 4) return 2;
        if (level >= 5 && level <= 8) return 3;
        if (level >= 9 && level <= 12) return 4;
        if (level >= 13 && level <= 16) return 5;
        if (level >= 17 && level <= 20) return 6;
        return 0; // W przypadku nieprawidłowego poziomu
    }

    // Dodaj listenery do zmian w wynikach cech
    for (const ability in abilityScores) {
        abilityScores[ability].addEventListener('input', updateAbilityScores);
    }
    // Dodaj listener dla zmiany poziomu, aby zaktualizować bonus biegłości
    document.getElementById('charLevel').addEventListener('input', updateSkills);

    // Initial calculations
    generateSkills(); // Wygeneruj umiejętności przy ładowaniu strony
    updateAbilityScores(); // Oblicz początkowe modyfikatory
});
