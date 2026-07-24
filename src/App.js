import { useEffect, useMemo, useState } from "react";
import "./App.css";
import logo from "./images/logo.png";

const createSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getEasternDateParts = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });

  return formatter.formatToParts(new Date()).reduce((values, part) => {
    if (part.type !== "literal") {
      values[part.type] = Number(part.value);
    }

    return values;
  }, {});
};

const getDailyRotationKey = () => {
  const easternDate = getEasternDateParts();

  const rotationDate = new Date(
    Date.UTC(
      easternDate.year,
      easternDate.month - 1,
      easternDate.day
    )
  );

  if (easternDate.hour < 9) {
    rotationDate.setUTCDate(rotationDate.getUTCDate() - 1);
  }

  return rotationDate.toISOString().slice(0, 10);
};

const getDailyIndex = (rotationKey, itemCount, offset = 0) => {
  const rotationDate = new Date(`${rotationKey}T00:00:00Z`);
  const startDate = new Date("2026-01-01T00:00:00Z");

  const differenceInDays = Math.floor(
    (rotationDate.getTime() - startDate.getTime()) / 86400000
  );

  return (
    ((differenceInDays + offset) % itemCount + itemCount) %
    itemCount
  );
};

const loreFeatures = [
  {
    name: "Alexstrasza",
    description:
      "Testing.",
  },
  {
    name: "Algalon the Observer",
    description:
      "Testing.",
  },
  {
    name: "Anduin Wrynn",
    description:
      "Explore the life of the young king of Stormwind and his struggle between faith, leadership, and responsibility.",
  },
  {
    name: "Archimonde",
    description:
      "Testing.",
  },
  {
    name: "Arthas Menethil",
    description:
      "Follow the tragic fall of Prince Arthas Menethil from celebrated paladin to the feared Lich King.",
  },
  {
    name: "Brann Bronzebeard",
    description:
      "Testing.",
  },
  {
    name: "C'Thun",
    description:
      "Testing.",
  },
  {
    name: "Cenarius",
    description:
      "Testing.",
  },
  {
    name: "Chromie",
    description:
      "Testing.",
  },
  {
    name: "Deathwing",
    description:
      "Testing.",
  },
  {
    name: "Freya",
    description:
      "Testing.",
  },
  {
    name: "Gruul the Dragonkiller",
    description:
      "Testing.",
  },
  {
    name: "Gul'dan",
    description:
      "Testing.",
  },
  {
    name: "Illidan Stormrage",
    description:
      "Discover the history of Illidan Stormrage, the legendary demon hunter known as the Betrayer.",
  },
  {
    name: "Kael'thas Sunstrider",
    description:
      "Learn about the prince of the blood elves and the desperate choices that led him toward corruption.",
  },
  {
    name: "Kalecgos",
    description:
      "Testing.",
  },
  {
    name: "Khadgar",
    description:
      "Testing.",
  },
  {
    name: "Kil'jaeden",
    description:
      "Testing.",
  },
  {
    name: "Lady Jaina Proudmoore",
    description:
      "Explore the history of one of Azeroth's most powerful mages, diplomats, and military leaders.",
  },
  {
    name: "Lady Vashj",
    description:
      "Testing.",
  },
  {
    name: "Magtheridon",
    description:
      "Testing.",
  },
  {
    name: "Malfurion Stormrage",
    description:
      "Testing.",
  },
  {
    name: "Mannoroth",
    description:
      "Testing.",
  },
  {
    name: "Medivh",
    description:
      "Testing.",
  },
  {
    name: "Murmur",
    description:
      "Testing.",
  },
  {
    name: "N'Zoth",
    description:
      "Testing.",
  },
  {
    name: "Onyxia",
    description:
      "Testing.",
  },
  {
    name: "Queen Azshara",
    description:
      "Explore the rise, fall, and transformation of one of the most powerful rulers in Azeroth's history.",
  },
  {
    name: "Sargeras",
    description:
      "Testing.",
  },
  {
    name: "Sylvannas Windrunner",
    description:
      "Testing.",
  },
  {
    name: "Teron Gorefiend",
    description:
      "Testing.",
  },
  {
    name: "The Lich King",
    description:
      "Testing.",
  },
  {
    name: "Thrall",
    description:
      "Testing.",
  },
  {
    name: "Tyrande Whisperwind",
    description:
      "Testing.",
  },
  {
    name: "Varian Wrynn",
    description:
      "Testing.",
  },
  {
    name: "Xavius",
    description:
      "Testing.",
  },
  {
    name: "Yogg-Saron",
    description:
      "Testing.",
  }
];

const dailyFacts = [
  // Classic World of Warcraft
  "Stormwind City was rebuilt after being destroyed during the First War.",
  "The Deeprun Tram connects Stormwind City with Ironforge.",
  "The Undercity was built beneath the ruined capital city of Lordaeron.",
  "Blackrock Mountain contains both Blackrock Depths and Blackrock Spire.",
  "Onyxia is the daughter of the black dragon aspect Deathwing.",
  "Nefarian is Onyxia's brother and the lord of Blackwing Lair.",
  "Ragnaros was summoned into Azeroth by the Dark Iron dwarves.",
  "The Defias Brotherhood was formed by workers who were not properly paid for rebuilding Stormwind.",
  "The original entrance to Naxxramas floated above the Eastern Plaguelands.",
  "The Scarlet Crusade believed nearly everyone outside its order could be infected by the Scourge.",
  "The Gurubashi trolls once ruled a vast empire from Zul'Gurub.",
  "The Cenarion Circle is devoted to preserving nature and maintaining balance.",
  "The Burning Steppes and Searing Gorge surround Blackrock Mountain.",
  "The Barrens was originally one enormous zone before the Cataclysm divided it.",
  "The Darkmoon Faire was founded by Silas Darkmoon.",
  "The Wetlands contain the remains of many ancient dwarven settlements.",
  "Maraudon is associated with Princess Theradras, an earth elemental princess.",
  "Scholomance was established beneath the Barov family's estate.",
  "Dire Maul was once the Highborne city of Eldre'Thalas.",
  "The green dragon Eranikus was corrupted within the Sunken Temple.",

  // The Burning Crusade
  "Outland is the shattered remains of the orc homeworld Draenor.",
  "The Dark Portal connects Azeroth with Outland.",
  "The draenei arrived on Azeroth aboard the Exodar.",
  "The Exodar is a section of the dimensional ship known as Tempest Keep.",
  "The blood elves joined the Horde during The Burning Crusade.",
  "Silvermoon City was rebuilt after being devastated by the Scourge.",
  "Kael'thas Sunstrider ruled the blood elves before his alliance with the Burning Legion.",
  "Illidan Stormrage ruled from the Black Temple in Shadowmoon Valley.",
  "Lady Vashj commanded the naga forces within Serpentshrine Cavern.",
  "Magtheridon was imprisoned beneath Hellfire Citadel.",
  "Karazhan was once the home of the Guardian Medivh.",
  "Prince Malchezaar served as the final original boss of Karazhan.",
  "The naaru are beings closely associated with the cosmic force of Light.",
  "The Aldor and the Scryers are rival factions based in Shattrath City.",
  "Netherstorm was damaged by magical energies after Draenor was torn apart.",
  "The fel orcs of Hellfire Citadel were empowered by demonic blood.",
  "The arakkoa are an ancient birdlike people native to Draenor.",
  "Gruul the Dragonkiller became famous for battling members of the black dragonflight.",
  "The Sunwell was restored using the heart of the naaru M'uru.",
  "Kil'jaeden attempted to enter Azeroth through the Sunwell.",

  // Wrath of the Lich King
  "Northrend is the frozen continent where the Lich King established his greatest stronghold.",
  "Icecrown Citadel was constructed around the Frozen Throne.",
  "Arthas Menethil became the Lich King after merging with Ner'zhul.",
  "Frostmourne was a cursed runeblade that stole the souls of those it killed.",
  "The Wrathgate was the site of a major battle involving the Horde, Alliance, and Scourge.",
  "Dalaran was magically moved to Northrend during the war against the Lich King.",
  "The Kirin Tor governs the magical city of Dalaran.",
  "Ulduar is a titan facility located in the Storm Peaks.",
  "Yogg-Saron was imprisoned beneath Ulduar.",
  "The keepers of Ulduar were created to watch over Azeroth.",
  "The dragon aspect Malygos launched a campaign against mortal spellcasters.",
  "The Nexus War centered on Malygos's attempt to control the use of arcane magic.",
  "The Argent Tournament was created to prepare champions for the assault on Icecrown Citadel.",
  "The Knights of the Ebon Blade are death knights who broke free from the Lich King's control.",
  "The taunka are distant relatives of the tauren.",
  "The tuskarr are a seafaring people native to Northrend.",
  "The vrykul are ancient ancestors of humanity.",
  "The Sons of Hodir are frost giants who live in the Storm Peaks.",
  "Naxxramas returned as a raid above Dragonblight.",
  "Bolvar Fordragon became the new Lich King after Arthas was defeated.",

  // Cataclysm
  "Deathwing's return caused the world-shattering event known as the Cataclysm.",
  "Deathwing was once the dragon aspect Neltharion the Earth-Warder.",
  "The goblins of the Bilgewater Cartel joined the Horde during the Cataclysm.",
  "Gilneas rejoined the Alliance after its people were afflicted by the worgen curse.",
  "The Maelstrom was created when the Well of Eternity collapsed.",
  "Deepholm is the elemental plane associated with earth.",
  "Therazane rules many of the earth elementals within Deepholm.",
  "Mount Hyjal was attacked by forces loyal to Ragnaros.",
  "The Firelands is the elemental plane of fire.",
  "The Twilight's Hammer worshiped the Old Gods and aided Deathwing.",
  "Cho'gall led the Twilight's Hammer during the Cataclysm.",
  "The Lost Isles became the temporary home of the Bilgewater goblins.",
  "Vashj'ir is an underwater region located near the Eastern Kingdoms.",
  "The Stonecore lies within Deepholm.",
  "Grim Batol was once a stronghold of the Wildhammer dwarves.",
  "Tol Barad became a contested battleground between the Horde and Alliance.",
  "The Dragon Soul was originally known as the Demon Soul.",
  "The Dragon Soul raid followed the attempt to stop Deathwing at the Maelstrom.",
  "The Hour of Twilight was the future the dragon aspects fought to prevent.",
  "The defeat of Deathwing ended the age of the dragon aspects.",

  // Mists of Pandaria
  "Pandaria was hidden from the rest of the world by magical mists.",
  "The pandaren emperor Shaohao used the mists to protect Pandaria.",
  "The Sha are physical manifestations of negative emotions.",
  "The Jade Forest is the first major region explored by many adventurers in Pandaria.",
  "The mogu once ruled Pandaria through fear and slavery.",
  "Lei Shen was known as the Thunder King.",
  "The mogu were created by the titans to shape and protect the land.",
  "The mantid swarm toward the Serpent's Spine in great cycles.",
  "The Shado-Pan defend Pandaria from the mantid and the Sha.",
  "The August Celestials are powerful Wild Gods who protect Pandaria.",
  "The Temple of the Jade Serpent honors the Jade Serpent Yu'lon.",
  "The Wandering Isle is carried on the back of the giant turtle Shen-zin Su.",
  "The Golden Lotus guarded the Vale of Eternal Blossoms.",
  "The Klaxxi are mantid paragons who served the Old God Y'Shaarj.",
  "Garrosh Hellscream used the heart of Y'Shaarj to empower his forces.",
  "The Siege of Orgrimmar ended Garrosh Hellscream's rule as warchief.",
  "The Isle of Thunder was the seat of Lei Shen's restored empire.",
  "The Timeless Isle exists outside the normal flow of time.",
  "The Tillers are a farming faction based in the Valley of the Four Winds.",
  "Chen Stormstout helped found the settlement of Halfhill.",

  // Warlords of Draenor
  "Warlords of Draenor takes place on an alternate version of Draenor.",
  "Garrosh Hellscream prevented the alternate orcs from drinking Mannoroth's blood.",
  "The Iron Horde was formed by several powerful orc clans.",
  "Grommash Hellscream initially led the Iron Horde.",
  "Frostfire Ridge is the homeland of the Frostwolf clan.",
  "Shadowmoon Valley is the homeland of the draenei on alternate Draenor.",
  "The draenei capital of Karabor later became the Black Temple in the original timeline.",
  "The Spires of Arak were once ruled by the high arakkoa.",
  "The Sethekk were outcast arakkoa who practiced shadow magic.",
  "The ogre empire of Highmaul was ruled by Imperator Mar'gok.",
  "The goren are creatures that consume stone and minerals.",
  "The Botani attempted to spread uncontrolled plant life across Draenor.",
  "The genesaur are enormous plant creatures created by the Evergrowth.",
  "Blackrock Foundry was the industrial center of the Iron Horde.",
  "The Iron Docks served as a major naval base for the Iron Horde.",
  "Ner'zhul led the Shadowmoon clan in the alternate timeline.",
  "Gul'dan remained loyal to the Burning Legion despite the Iron Horde's creation.",
  "Archimonde was defeated at Hellfire Citadel.",
  "Tanaan Jungle became the center of the Legion's invasion of Draenor.",
  "The player established a personal garrison while fighting the Iron Horde.",

  // Legion
  "The Broken Isles became the center of the Burning Legion's third invasion of Azeroth.",
  "The Tomb of Sargeras served as a gateway for the Burning Legion.",
  "Demon hunters were trained by Illidan Stormrage to fight the Legion.",
  "Class order halls united members of each class against the Burning Legion.",
  "Artifact weapons were empowered throughout the campaign against the Legion.",
  "The Pillars of Creation were used to seal the Tomb of Sargeras.",
  "Suramar was protected for thousands of years by a magical barrier.",
  "The nightborne survived by drawing power from the Nightwell.",
  "The Emerald Nightmare was connected to the corruption of the Emerald Dream.",
  "Xavius became the Nightmare Lord after serving the Burning Legion.",
  "The Eye of Azshara is associated with naga forces loyal to Queen Azshara.",
  "Odyn rules the Halls of Valor.",
  "Helya created the Helarjar and ruled the realm of Helheim.",
  "The Army of the Light fought the Burning Legion across the cosmos.",
  "The draenei homeworld Argus became the Legion's primary stronghold.",
  "The Vindicaar carried Azeroth's champions to Argus.",
  "The Pantheon imprisoned Sargeras at the end of the Argus campaign.",
  "Sargeras wounded Azeroth by plunging his sword into Silithus.",
  "Illidan remained with the Pantheon to confront Sargeras.",
  "Argus the Unmaker was the final boss of Antorus, the Burning Throne.",

  // Battle for Azeroth
  "Battle for Azeroth began with open war between the Horde and Alliance.",
  "The burning of Teldrassil destroyed the night elves' great world tree.",
  "The Battle for Lordaeron forced the Forsaken from the Undercity.",
  "Kul Tiras is a powerful human maritime kingdom.",
  "Zandalar is the ancient homeland of the Zandalari trolls.",
  "Boralus is the capital city of Kul Tiras.",
  "Dazar'alor is the capital of the Zandalari Empire.",
  "The loa are powerful spirits worshiped by many troll cultures.",
  "Bwonsamdi is the loa associated with death.",
  "The blood trolls of Nazmir worshiped the artificial Old God G'huun.",
  "Uldir was a titan facility created to study and contain corruption.",
  "The Heart of Azeroth was used to collect and channel Azerite.",
  "Azerite appeared across the world after Sargeras wounded Azeroth.",
  "Queen Azshara ruled the naga from the underwater kingdom of Nazjatar.",
  "Mechagon was ruled by King Mechagon.",
  "The mechagnomes of Mechagon modified their bodies with mechanical parts.",
  "N'Zoth was the final Old God to openly threaten Azeroth.",
  "Ny'alotha was a realm shaped by the power of N'Zoth.",
  "The Fourth War ended after the rebellion against Sylvanas Windrunner.",
  "Saurfang challenged Sylvanas to mak'gora outside Orgrimmar.",

  // Shadowlands
  "The Shadowlands is the realm where mortal souls travel after death.",
  "Oribos served as the central city of the Shadowlands.",
  "The Arbiter once judged souls and sent them to their appropriate afterlives.",
  "The Maw was intended to imprison the most dangerous souls.",
  "The Jailer ruled the Maw from Torghast.",
  "Bastion is home to the kyrian covenant.",
  "Maldraxxus serves as the military power of the Shadowlands.",
  "Ardenweald protects spirits connected to nature and rebirth.",
  "Revendreth allows sinful souls to seek redemption.",
  "The venthyr are the ruling people of Revendreth.",
  "The Winter Queen rules Ardenweald.",
  "The Primus is the leader of Maldraxxus.",
  "The Archon leads the kyrian of Bastion.",
  "Sire Denathrius ruled Revendreth from Castle Nathria.",
  "Anima is a vital source of power throughout the Shadowlands.",
  "The drought of anima weakened the realms of the Shadowlands.",
  "Torghast is a massive prison controlled by the Jailer.",
  "Korthia was pulled into the Maw by the Jailer's forces.",
  "Zereth Mortis was created by the mysterious First Ones.",
  "The Helm of Domination was destroyed when the veil between life and death was shattered.",

  // Dragonflight
  "The Dragon Isles awakened after being hidden for thousands of years.",
  "The dracthyr were created by Neltharion to serve as elite soldiers.",
  "Dracthyr can wield the magic of all five major dragonflights.",
  "The Waking Shores is the ancestral homeland of the red dragonflight.",
  "Valdrakken became the major city of the Dragon Isles.",
  "The Ohn'ahran Plains are home to several centaur clans.",
  "The Azure Span contains the ancient archives of the blue dragonflight.",
  "Thaldraszus is closely associated with the bronze dragonflight.",
  "The Primal Incarnates rejected the titans' influence over dragonkind.",
  "Raszageth was the Primal Incarnate of wind.",
  "Vault of the Incarnates was used to imprison the Primal Incarnates.",
  "Aberrus was a hidden laboratory created by Neltharion.",
  "The Zaralek Cavern lies beneath the Dragon Isles.",
  "The niffen are molelike people who live in Zaralek Cavern.",
  "The Emerald Dream became a major battlefield against Fyrakk.",
  "Fyrakk was empowered by shadowflame.",
  "Amirdrassil was grown from a seed connected to the renewal of the night elves.",
  "The dragon aspects regained their power through unity rather than titan intervention.",
  "Iridikron is the Primal Incarnate associated with earth.",
  "The Infinite dragonflight seeks to disrupt important moments in history.",

  // The War Within
  "The War Within begins a larger storyline known as the Worldsoul Saga.",
  "Khaz Algar is a major setting in The War Within.",
  "Dornogal serves as the central city of Khaz Algar.",
  "The earthen are titan-forged beings made from stone.",
  "The earthen of Khaz Algar developed cultures distinct from those of other titan-forged peoples.",
  "The Isle of Dorn is the surface region of Khaz Algar.",
  "The Ringing Deeps contains vast underground foundries and industrial settlements.",
  "Hallowfall is illuminated by a massive crystal known as Beledar.",
  "The Arathi of Hallowfall have survived for generations beneath the surface.",
  "Azj-Kahet is a major nerubian kingdom.",
  "The nerubians of Azj-Kahet are ruled through a complex royal hierarchy.",
  "Xal'atath plays a central role in the events of The War Within.",
  "The void is one of the major cosmic forces threatening Azeroth.",
  "Delves are small-scale adventures designed for one to five players.",
  "Brann Bronzebeard accompanies players during many delves.",
  "Warbands allow account-wide progression and shared collections between characters.",
  "The Coreway connects several regions beneath Khaz Algar.",
  "The Earthen allied race is connected to the story of Khaz Algar.",
  "The War Within explores civilizations living deep beneath Azeroth's surface.",
  "Azeroth is described as a developing world-soul.",
];

const triviaQuestions = [
  {
    question: "Which prince eventually became the Lich King?",
    choices: [
      "Anduin Wrynn",
      "Arthas Menethil",
      "Kael'thas Sunstrider",
      "Varian Wrynn",
    ],
    answer: "Arthas Menethil",
  },
  {
    question:
      "Which dragon aspect is associated with the bronze dragonflight?",
    choices: ["Nozdormu", "Alexstrasza", "Kalecgos", "Ysera"],
    answer: "Nozdormu",
  },
];

const aberrationLinks = [
  "Beastman",
  "Beholder Eye",
  "Blood Abomination",
  "Blood Elemental",
  "Boggart",
  "Consumer of Souls",
  "Devourer",
  "Eye Stalk",
  "Eyeball Jellyfish",
  "Fetid Devourer",
  "Fleshbeast",
  "Forgotten One",
  "G'huun",
  "Haunt",
  "Il'gynoth",
  "Manifestation",
  "Maw Creature",
  "Mawfiend",
  "Merciless One",
  "N'raqi",
  "Old God",
  "Ooze",
  "Psyfiend",
  "Serpent of N'Zoth",
  "Sludge",
  "Spawn of G'huun",
  "Tentacle",
  "Wicker Construct",
];

const battlePetLinks = [
  "Aquatic",
  "Beast",
  "Critter",
  "Dragonkin",
  "Elemental",
  "Flying",
  "Humanoid",
  "Magic",
  "Mechanical",
  "Undead",
];

const beastLinks = [
  "Alpaca",
  "Aqiri",
  "Arachnathid",
  "Armadillo",
  "Basilisk",
  "Bat",
  "Bear",
  "Bee",
  "Beetle",
  "Bird of Prey",
  "Blood Beast",
  "Blood Tick",
  "Boar",
  "Brutosaur",
  "Butterfly",
  "Camel",
  "Carapid",
  "Carp",
  "Carrion Bird",
  "Cat",
  "Chimaera",
  "Clam",
  "Clefthoof",
  "Core Hound",
  "Coyote",
  "Crab",
  "Crawdad",
  "Crocolisk",
  "Deathroach",
  "Devilsaur",
  "Diemetradon",
  "Direhorn",
  "Dolphin",
  "Donkey",
  "Dragonhawk",
  "Eel",
  "Elekk",
  "Feathermane",
  "Firefly",
  "Fly",
  "Fox",
  "Frenzy",
  "Giraffe",
  "Gorilla",
  "Gromit",
  "Grouper",
  "Gruffhorn",
  "Gyreworm",
  "Horse",
  "Hound",
  "Hydra",
  "Hyena",
  "Jellyfish",
  "Kodo",
  "Kraken",
  "Kunchong",
  "Larva",
  "Lesser Dragonkin",
  "Lizard",
  "Mammoth",
  "Mana Wyrm",
  "Mechanical",
  "Monkey",
  "Moth",
  "Mushan",
  "Octopus",
  "Orca",
  "Oxen",
  "Pterrordax",
  "Pufferfish",
  "Raptor",
  "Ravager",
  "Ray",
  "Rhino",
  "Riverbeast",
  "Rodent",
  "Sand Reaver",
  "Scalehide",
  "Scorpid",
  "Seahorse",
  "Seal",
  "Serpent",
  "Shale Beast",
  "Shark",
  "Silithid",
  "Snail",
  "Snapdragon",
  "Spider",
  "Spirit Beast",
  "Spore Walker",
  "Sporebat",
  "Squid",
  "Stag",
  "Starfish",
  "Talbuk",
  "Tallstrider",
  "Threshadon",
  "Thunder Lizard",
  "Toad",
  "Trilobite",
  "Turtle",
  "Warp Stalker",
  "Wasp",
  "Water Strider",
  "Waterfowl",
  "Whale",
  "Wind Serpent",
  "Wolf",
  "Worm",
  "Zhevra",
];

const critterLinks = [
  "Amphibian",
  "Arachnid",
  "Bird",
  "Crustacean",
  "Fish",
  "Insect",
  "Mammal",
  "Reptile",
];

const demonLinks = [
  "Abyssal",
  "Antaen",
  "Aranasi",
  "Bilescourge",
  "Darkglare",
  "Darkhound",
  "Doomguard",
  "Doomlord",
  "Doommaiden",
  "Dreadlord",
  "Felbat",
  "Felboar",
  "Felguard",
  "Felhound",
  "Felsaber",
  "Felsteed",
  "Felwolf",
  "Flamekin",
  "Floating Eye",
  "Gan'arg",
  "Grell",
  "Imp",
  "Imp Mother",
  "Inferno",
  "Inquisitor",
  "Jailer",
  "Mo'arg",
  "Overfiend",
  "Pit Lord",
  "Satyr",
  "Shivarra",
  "Spider Demon",
  "Succubus",
  "Terrorguard",
  "Ur'zul",
  "Vilefiend",
  "Void God",
  "Void Hound",
  "Void Lord",
  "Void Revenant",
  "Void Terror",
  "Void Wolf",
  "Voidcaller",
  "Voidwalker",
  "Voidwraith",
  "Wrathguard",
  "Wrathsteed",
  "Wyrmtongue",
];

const dragonkinLinks = [
  "Black Dragon",
  "Bloodbrood",
  "Blue Dragon",
  "Bone Drake",
  "Chromatic Dragon",
  "Cloud Serpent",
  "Dracthyr",
  "Dragonman",
  "Dragonspawn",
  "Drakeadon",
  "Faerie Dragon",
  "Frostbrood",
  "Green Dragon",
  "Hornswog",
  "Infinite Dragon",
  "Nether Dragon",
  "Nightmare Dragon",
  "Plagued Dragon",
  "Proto-Dragon",
  "Red Dragon",
  "Stone Drake",
  "Storm Drake",
  "Tarasek",
  "Twilight Dragon",
  "Veilwing",
  "Velocidrake",
  "Vilebrood",
  "Whelp",
  "Wylderdrake",
  "Wyrm",
];

const elementalLinks = [
  "Air Elemental",
  "Air Revenant",
  "Alemental",
  "Arcane Elemental",
  "Azerite Elemental",
  "Bog Beast",
  "Bound Air Elemental",
  "Bound Earth Elemental",
  "Bound Fire Elemental",
  "Bound Water Elemental",
  "Djinn",
  "Earth Elemental",
  "Earth Revenant",
  "Elemental Ascendant",
  "Entropic Elemental",
  "Fire Elemental",
  "Fire Hawk",
  "Fire Revenant",
  "Flux Animator",
  "Geode",
  "Ice Elemental",
  "Ice Revenant",
  "Lasher",
  "Lava Elemental",
  "Light Elemental",
  "Lightning Elemental",
  "Mana Elemental",
  "Mercury Elemental",
  "Pandaren Air Elemental",
  "Pandaren Earth Elemental",
  "Pandaren Fire Elemental",
  "Pandaren Water Elemental",
  "Phoenix",
  "Primordial Essence",
  "Sand Elemental",
  "Sha",
  "Shadow Elemental",
  "Shadow Revenant",
  "Spark",
  "Spitter",
  "Spore",
  "Steam Elemental",
  "Treant",
  "Unbound Air Elemental",
  "Unbound Earth Elemental",
  "Unbound Fire Elemental",
  "Unbound Lightning Elemental",
  "Unbound Water Elemental",
  "Water Elemental",
  "Water Revenant",
];

const giantLinks = [
  "Ancient Protector",
  "Anubisath",
  "Colossal",
  "Colossus",
  "Ettin",
  "Fire Giant",
  "Flesh Giant",
  "Frost Giant",
  "Fungal Giant",
  "Genesaur",
  "Gronn",
  "Ice Giant",
  "Iron Giant",
  "Magnaron",
  "Mountain Giant",
  "Ogron",
  "Sea Giant",
  "Slime Giant",
  "Stone Giant",
  "Storm Giant",
  "Titanic Watcher",
];

const humanoidLinks = [
  "Arakkoa",
  "Blood Elf",
  "Broken",
  "Centaur",
  "Dark Iron Dwarf",
  "Dark Troll",
  "Darkfallen",
  "Dire Troll",
  "Draenei",
  "Dryad",
  "Dwarf",
  "Earthen Dwarf",
  "Ethereal",
  "Fel Orc",
  "Felblood Elf",
  "Flamewaker",
  "Forest Troll",
  "Frost Nymph",
  "Frost Vrykul",
  "Frostborn Dwarf",
  "Fungret",
  "Furbolg",
  "Gilgoblin",
  "Gnoll",
  "Gnome",
  "Goblin",
  "Gorloc",
  "Grummle",
  "Harpy",
  "Highmountain Tauren",
  "Hobgoblin",
  "Hozen",
  "Human",
  "Ice Troll",
  "Iron Dwarf",
  "Iron Vrykul",
  "Jinyu",
  "Jungle Troll",
  "Kobold",
  "Kvaldir",
  "Leper Gnome",
  "Lobstrok",
  "Lost One",
  "Mag'har Orc",
  "Magnataur",
  "Makrura",
  "Mantid",
  "Mogu",
  "Murloc",
  "Naga",
  "Night Elf",
  "Nightfallen",
  "Nymph",
  "Ogre",
  "Ogre Lord",
  "Orc",
  "Pandaren",
  "Pygmy",
  "Qiraji",
  "Quilboar",
  "Ranishu",
  "Rock Flayer",
  "Sand Troll",
  "Sasquatch",
  "Saurok",
  "Sethrak",
  "Siren",
  "Snobold",
  "Sporeling",
  "Stone Trogg",
  "Taunka",
  "Tauren",
  "Tol'vir",
  "Tortollan",
  "Trogg",
  "Troll",
  "Tuskarr",
  "Virmen",
  "Vrykul",
  "Vulpera",
  "Wendigo",
  "Wildkin",
  "Wolvar",
  "Worgen",
  "Wretched",
  "Yaungol",
  "Yeti",
  "Zandalari Troll",
];

const mechanicalLinks = [
  "Alarm-o-Bot",
  "Apexis Guardian",
  "Arcane Titan",
  "Blingtron",
  "Bombling",
  "Cannon",
  "Centurion",
  "Chopper",
  "Clockwork Giant",
  "Clockwork Robot",
  "Crowd Pummeler",
  "Drakkari Golem",
  "Dwarven Golem",
  "Extractor",
  "Fel Reaver",
  "Flame Leviathan",
  "Flying Machine",
  "Gnomebot",
  "Harvest Golem",
  "Hot Rod",
  "Iron Golem",
  "Iron Juggernaut",
  "Iron Star",
  "Mechagnome",
  "Mechanical Chicken",
  "Mechanical Dog",
  "Mechanical Dragon",
  "Mechanical Greench",
  "Mechanical Spider",
  "Mechanical Wolf",
  "Mechanical Yeti",
  "Mechano-Tank",
  "Mechanocat",
  "Mechanostrider",
  "Microbot",
  "Mole Machine",
  "Nightborne Construct",
  "Pounder Robot",
  "Rascal-Bot",
  "Shredder",
  "Sinstone Golem",
  "Stone Golem",
  "Trike",
  "Vigilant",
  "Zandalari Golem",
];

const uncategorizedLinks = [
  "Angel",
  "Animated Object",
  "August Celestial",
  "Constellar",
  "Devourer of Souls",
  "Eye of Kilrogg",
  "Naaru",
  "Titan",
  "Wild God",
  "Wisp",
];

const undeadLinks = [
  "Abomination",
  "Banshee",
  "Bone Golem",
  "Bone Wraith",
  "Corpsehand",
  "Crawling Hand",
  "Crawling Spine",
  "Crypt Fiend",
  "Crypt Lord",
  "Death Knight",
  "Deathcharger",
  "Deathlord",
  "Deathroc",
  "Emberwyrm",
  "Fel Dragon",
  "Flesh Beast",
  "Floating Skull",
  "Forsaken",
  "Frost Wyrm",
  "Gargoyle",
  "Geist",
  "Ghost",
  "Ghoul",
  "Husk",
  "Lich",
  "Mad Scientist",
  "Magmawyrm",
  "Mummy",
  "Mur'ghoul",
  "Plague Dog",
  "Plague Eruptor",
  "Shade",
  "Skeletal Gryphon",
  "Skeletal Horse",
  "Skeletal Hound",
  "Skeletal Mage",
  "Skeletal Raptor",
  "Skeleton",
  "Spectral Gryphon",
  "Spectral Saber",
  "Spectre",
  "Troll Lich",
  "Val'kyr",
  "Vampire",
  "Vargul",
  "Wight",
  "Wraith",
  "Zombie",
];

const navItems = [
  {
    title: "Home",
    path: "/",
    links: [],
  },
  {
    title: "Classes",
    path: "/classes",
    links: [
      "Death Knight",
      "Demon Hunter",
      "Druid",
      "Evoker",
      "Hunter",
      "Mage",
      "Monk",
      "Paladin",
      "Priest",
      "Rogue",
      "Shaman",
      "Warlock",
      "Warrior",
    ],
  },
  {
    title: "Instances",
    path: "/instances",
    links: [
      "Vanilla",
      "The Burning Crusade",
      "Wrath of the Lich King",
      "Cataclysm",
      "Mists of Pandaria",
      "Warlords of Draenor",
      "Legion",
      "Battle for Azeroth",
      "Shadowlands",
      "Dragonflight",
      "The War Within",
      "Midnight",
      "The Last Titan",
    ],
  },
  {
    title: "Lore",
    path: "/lore",
    dropdownClass: "lore-dropdown",
    links: loreFeatures.map((feature) => feature.name),
  },
  {
    title: "NPCs",
    path: "/npcs",
    dropdownClass: "npcs-dropdown",
    links: [
      {
        name: "Aberrations",
        heading: "Aberration Families",
        path: "/npcs/aberrations",
        childPath: "/npcs/aberrations",
        children: aberrationLinks,
        submenuClass: "aberrations-submenu",
      },
      {
        name: "Battle Pets",
        heading: "Battle Pet Families",
        path: "/npcs/battle-pets",
        childPath: "/npcs/battle-pets",
        children: battlePetLinks,
        submenuClass: "battle-pets-submenu",
      },
      {
        name: "Beasts",
        heading: "Beast Families",
        path: "/npcs/beasts",
        childPath: "/npcs/beasts",
        children: beastLinks,
        submenuClass: "beasts-submenu",
      },
      {
        name: "Critters",
        heading: "Critter Families",
        path: "/npcs/critters",
        childPath: "/npcs/critters",
        children: critterLinks,
        submenuClass: "critters-submenu",
      },
      {
        name: "Demons",
        heading: "Demon Families",
        path: "/npcs/demons",
        childPath: "/npcs/demons",
        children: demonLinks,
        submenuClass: "demons-submenu",
      },
      {
        name: "Dragonkin",
        heading: "Dragonkin Families",
        path: "/npcs/dragonkin",
        childPath: "/npcs/dragonkin",
        children: dragonkinLinks,
        submenuClass: "dragonkin-submenu",
      },
      {
        name: "Elementals",
        heading: "Elemental Families",
        path: "/npcs/elementals",
        childPath: "/npcs/elementals",
        children: elementalLinks,
        submenuClass: "elementals-submenu",
      },
      {
        name: "Giants",
        heading: "Giant Families",
        path: "/npcs/giants",
        childPath: "/npcs/giants",
        children: giantLinks,
        submenuClass: "giants-submenu",
      },
      {
        name: "Humanoids",
        heading: "Humanoid Families",
        path: "/npcs/humanoids",
        childPath: "/npcs/humanoids",
        children: humanoidLinks,
        submenuClass: "humanoids-submenu",
      },
      {
        name: "Mechanical",
        heading: "Mechanical Families",
        path: "/npcs/mechanical",
        childPath: "/npcs/mechanical",
        children: mechanicalLinks,
        submenuClass: "mechanical-submenu",
      },
      {
        name: "Uncategorized",
        heading: "Uncategorized NPCs",
        path: "/npcs/uncategorized",
        childPath: "/npcs/uncategorized",
        children: uncategorizedLinks,
        submenuClass: "uncategorized-submenu",
      },
      {
        name: "Undead",
        heading: "Undead Families",
        path: "/npcs/undead",
        childPath: "/npcs/undead",
        children: undeadLinks,
        submenuClass: "undead-submenu",
      },
    ],
  },
  {
    title: "Professions & Skills",
    path: "/professions-and-skills",
    links: [
      "Alchemy",
      "Archaeology",
      "Blacksmithing",
      "Cooking",
      "Enchanting",
      "Engineering",
      "Fishing",
      "Herbalism",
      "Inscription",
      "Jewelcrafting",
      "Leatherworking",
      "Mining",
      "Riding",
      "Skinning",
      "Tailoring",
    ],
  },
  {
    title: "Races",
    path: "/races",
    links: [
      "Blood Elf",
      "Dark Iron Dwarf",
      "Dracthyr",
      "Draenei",
      "Dwarf",
      "Earthen",
      "Forsaken",
      "Goblin",
      "Gnome",
      "Human",
      "Kul Tiran",
      "Night Elf",
      "Orc",
      "Pandaren",
      "Tauren",
      "Troll",
      "Void Elf",
      "Vulpera",
      "Worgen",
      "Zandalari Troll",
    ],
  },
  {
    title: "World Events",
    path: "/world-events",
    alignRight: true,
    links: [
      "Brewfest",
      "Children's Week",
      "Darkmoon Faire",
      "Day of the Dead",
      "Feast of Winter Veil",
      "Hallow's End",
      "Harvest Festival",
      "Love is in the Air",
      "Lunar Festival",
      "Midsummer Fire Festival",
      "Noblegarden",
      "Pilgrim's Bounty",
      "WoW Anniversary",
    ],
  },
  {
    title: "Zones",
    path: "/zones",
    alignRight: true,
    links: [
      "Vanilla",
      "The Burning Crusade",
      "Wrath of the Lich King",
      "Cataclysm",
      "Mists of Pandaria",
      "Warlords of Draenor",
      "Legion",
      "Battle for Azeroth",
      "Shadowlands",
      "Dragonflight",
      "The War Within",
      "Midnight",
      "The Last Titan",
    ],
  },
];

function NestedDropdown({ link }) {
  return (
    <div className={`nested-dropdown ${link.submenuClass || ""}`}>
      <div className="nested-dropdown-heading">
        {link.heading}
      </div>

      <div className="nested-dropdown-grid">
        {link.children.map((childLink) => (
          <a
            className="nested-dropdown-link"
            href={`${link.childPath}/${createSlug(childLink)}`}
            key={childLink}
          >
            {childLink}
          </a>
        ))}
      </div>
    </div>
  );
}

function NavigationDropdown({ item }) {
  if (!item.links.length) {
    return null;
  }

  return (
    <div
      className={[
        "dropdown",
        item.alignRight ? "dropdown-align-right" : "",
        item.dropdownClass || "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="dropdown-grid">
        {item.links.map((link) => {
          const isNestedLink =
            typeof link === "object" &&
            Array.isArray(link.children);

          const linkName = isNestedLink ? link.name : link;

          if (isNestedLink) {
            return (
              <div
                className="dropdown-entry has-nested-dropdown"
                key={linkName}
              >
                <a
                  className="dropdown-link nested-dropdown-trigger"
                  href={link.path}
                >
                  <span>{linkName}</span>

                  <span
                    className="submenu-arrow"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </a>

                <NestedDropdown link={link} />
              </div>
            );
          }

          return (
            <div className="dropdown-entry" key={linkName}>
              <a
                className="dropdown-link"
                href={`/${createSlug(item.title)}/${createSlug(
                  linkName
                )}`}
              >
                {linkName}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [rotationKey, setRotationKey] = useState(
    getDailyRotationKey
  );

  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    const updateDailyContent = () => {
      const currentRotationKey = getDailyRotationKey();

      setRotationKey((previousRotationKey) => {
        if (previousRotationKey !== currentRotationKey) {
          setSelectedAnswer("");
          return currentRotationKey;
        }

        return previousRotationKey;
      });
    };

    updateDailyContent();

    const interval = window.setInterval(
      updateDailyContent,
      60000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const featuredLore = useMemo(() => {
    return loreFeatures[
      getDailyIndex(rotationKey, loreFeatures.length)
    ];
  }, [rotationKey]);

  const dailyFact = useMemo(() => {
    return dailyFacts[
      getDailyIndex(rotationKey, dailyFacts.length, 2)
    ];
  }, [rotationKey]);

  const dailyTrivia = useMemo(() => {
    return triviaQuestions[
      getDailyIndex(rotationKey, triviaQuestions.length, 4)
    ];
  }, [rotationKey]);

  const isCorrect =
    selectedAnswer === dailyTrivia.answer;

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <a
            className="brand-logo-link"
            href="/"
            aria-label="Homepage"
          >
            <img
              src={logo}
              alt="The Azeroth Archives logo"
              className="logo"
            />
          </a>

          <a className="brand-name" href="/">
            The Azeroth Archives
          </a>
        </div>

        <nav
          className="main-nav"
          aria-label="Main navigation"
        >
          <div className="nav-container">
            {navItems.map((item) => (
              <div
                className={`nav-item ${
                  item.links.length ? "has-dropdown" : ""
                }`}
                key={item.title}
              >
                <a href={item.path} className="nav-link">
                  <span>{item.title}</span>

                  {item.links.length > 0 && (
                    <span
                      className="nav-arrow"
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  )}
                </a>

                <NavigationDropdown item={item} />
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-eyebrow">
              Knowledge of Azeroth Awaits
            </p>

            <h1>Your World of Warcraft Encyclopedia</h1>

            <p className="hero-description">
              Search the archives of Azeroth for heroes,
              villains, quests, races, professions, zones,
              dungeons, raids, creatures, and legendary lore.
            </p>

            <a className="hero-button" href="/lore">
              Enter the Archives
            </a>
          </div>
        </section>

        <section className="homepage-content">
          <div className="section-heading">
            <p className="section-eyebrow">
              From Across Azeroth
            </p>

            <h2>Daily Archive Features</h2>

            <p>
              Featured content changes every day at 9:00 AM
              Eastern Time.
            </p>
          </div>

          <div className="content-grid">
            <section className="feature-column">
              <article className="archive-card">
                <span className="card-category">
                  Featured Lore
                </span>

                <h2>{featuredLore.name}</h2>

                <p>{featuredLore.description}</p>

                <a
                  className="read-more"
                  href={`/lore/${createSlug(
                    featuredLore.name
                  )}`}
                >
                  Read More →
                </a>
              </article>

              <article className="archive-card">
                <span className="card-category">
                  WoW Daily Facts
                </span>

                <h2>Today's Azeroth Fact</h2>

                <div className="fact-content">
                  <span>✦</span>
                  <p>{dailyFact}</p>
                </div>
              </article>

              <article className="archive-card">
                <span className="card-category">
                  WoW Trivia
                </span>

                <h2>{dailyTrivia.question}</h2>

                <div className="trivia-options">
                  {dailyTrivia.choices.map(
                    (choice, index) => {
                      let buttonClass = "trivia-button";

                      if (selectedAnswer) {
                        if (
                          choice === dailyTrivia.answer
                        ) {
                          buttonClass +=
                            " correct-answer";
                        } else if (
                          choice === selectedAnswer
                        ) {
                          buttonClass +=
                            " incorrect-answer";
                        } else {
                          buttonClass += " unanswered";
                        }
                      }

                      return (
                        <button
                          type="button"
                          className={buttonClass}
                          disabled={Boolean(
                            selectedAnswer
                          )}
                          onClick={() =>
                            setSelectedAnswer(choice)
                          }
                          key={choice}
                        >
                          <span className="answer-letter">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>

                          <span>{choice}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {selectedAnswer && (
                  <div
                    className={`trivia-result ${
                      isCorrect
                        ? "correct-result"
                        : "incorrect-result"
                    }`}
                  >
                    <strong>
                      {isCorrect
                        ? "Correct!"
                        : "That answer is incorrect."}
                    </strong>

                    <p>
                      The correct answer is{" "}
                      <strong>{dailyTrivia.answer}</strong>.
                    </p>
                  </div>
                )}
              </article>
            </section>

            <aside className="sidebar">
              <div className="sidebar-card podcast-sidebar">
                <h2>Listen to Our Podcast</h2>

                <div className="podcast-archive">
                  <details className="podcast-year" open>
                    <summary>2026</summary>

                    <div className="podcast-year-content">
                      <details className="podcast-month" open>
                        <summary>September</summary>

                        <ul className="podcast-episode-list">
                          <li>
                            <a
                              href="https://www.youtube.com"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Episode 1: TBA
                            </a>
                          </li>
                        </ul>
                      </details>

                      <details className="podcast-month">
                        <summary>October</summary>

                        <ul className="podcast-episode-list">
                          <li>
                            <span>Coming Soon</span>
                          </li>
                        </ul>
                      </details>

                      <details className="podcast-month">
                        <summary>November</summary>

                        <ul className="podcast-episode-list">
                          <li>
                            <span>Coming Soon</span>
                          </li>
                        </ul>
                      </details>

                      <details className="podcast-month">
                        <summary>December</summary>

                        <ul className="podcast-episode-list">
                          <li>
                            <span>Coming Soon</span>
                          </li>
                        </ul>
                      </details>
                    </div>
                  </details>

                  <details className="podcast-year">
                    <summary>2027</summary>

                    <div className="podcast-year-content">
                      <details className="podcast-month">
                        <summary>January</summary>

                        <ul className="podcast-episode-list">
                          <li>
                            <span>Coming Soon</span>
                          </li>
                        </ul>
                      </details>
                    </div>
                  </details>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © 2026 The Azeroth Archives. Website Designed and
          Developed by Scotty McCoy.
        </p>
      </footer>
    </div>
  );
}

export default App;