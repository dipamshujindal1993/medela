import React from "react";
import CreditCardIcon from '../../Images/svg/ic_credit_card.svg'
import ChiaSeedIcon from '../../Images/svg/ic_chia_seed.svg'
import SunFlowerFeedIcon from '../../Images/svg/ic_sunflower_seed.svg'
import SnowCrystalIcon from '../../Images/svg/ic_snow_crystal.svg'
import HandCreamIcon from '../../Images/svg/ic_hand_cream.svg'
import PopsicleIcon from '../../Images/svg/ic_popsicle.svg'
import RiceIcon from '../../Images/svg/ic_rice.svg'
import LadyBugIcon from '../../Images/svg/ic_ladybug.svg'
import FingerNailIcon from '../../Images/svg/ic_finger_nail.svg'
import ButtonIcon from '../../Images/svg/ic_button.svg'
import EarPhonesIcon from '../../Images/svg/ic_earphones.svg'
import HairpinIcon from '../../Images/svg/ic_hairpin.svg'
import LipStickIcon from '../../Images/svg/ic_ladybug.svg'
import NailPolishIcon from '../../Images/svg/ic_nail_polish.svg'
import HighlighterIcon from '../../Images/svg/ic_highlighter.svg'
import PencilIcon from '../../Images/svg/ic_pencil.svg'
import SmartPhoneIcon from '../../Images/svg/ic_smartphone.svg'
import KitchenPaperIcon from '../../Images/svg/ic_kitchen_paper.svg'
import SpaghettiIcon from '../../Images/svg/ic_spaghetti.svg'
import MagazineIcon from '../../Images/svg/ic_magazine.svg'
import LaptopIcon from '../../Images/svg/ic_laptop.svg'
import SoftDrinkIcon from '../../Images/svg/ic_soft_drink.svg'
import ChairIcon from '../../Images/svg/ic_chair.svg'
import CatIcon from '../../Images/svg/ic_cat.svg'
import FullTermSizeIcon from '../../Images/svg/ic_full_term_baby.svg'
import {countryCode} from '../../Utils/locale'

import Colors from "../../Resources/Colors";
import styles from '../../Containers/Styles/MyBabyScreenStyles'

let BabySize = {
  "timeSlice": [
    ///
    {
      "size": "Pumpkin",
      "length": countryCode() === "US" ? "20.58 in" : "52.2cm",
      "weight": countryCode() === "US" ? "7.89 lb" : "3619.7 g",
      "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "full term baby size"
    },
    {
      "size": "Watermelon",
      "length": countryCode() === "US" ? "20.31 in" : "51.6 cm",
      "weight": countryCode() === "US" ? "7.78 lb" : "3528.9 g",
      "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "full term baby size"
    },
    {
      "size": "Crenshaw melon",
      "length": countryCode() === "US" ? "19.98 in" : "50.7 cm",
      "weight": countryCode() === "US" ? "7.26 lb" : "3293.1 g",
      "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "full term baby size"
    },
    {
      "size": "Butter squash",
      "length": countryCode() === "US" ? "19.51 in" : "49.5 cm",
      "weight": countryCode() === "US" ? "6.36 lb" : "2884.8 g",
      "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "full term baby size"
    },
    {
      "size": "Napa cabbage",
      "length": countryCode() === "US" ? "18.99 in" : "48.2 cm",
      "weight": countryCode() === "US" ? "5.84 lb" : "2648.9 g",
      "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "cat"
    },
    {
      "size": "Romaine Lettuce",
      "length": countryCode() === "US" ? "18.64 in" : "47.3 cm",
      "weight": countryCode() === "US" ? "5.33 lb" : "2417.6 g",
      "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "cat"
    },
    {
      "size": "Celery",
      "length": countryCode() === "US" ? "18.12 in" : "46 cm",
      "weight": countryCode() === "US" ? "4.82 lb" : "2186.3 g",
      "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "cat"
    },
    {
      "size": "Honeydew",
      "length": countryCode() === "US" ? "17.65 in" : "44.8 cm",
      "weight": countryCode() === "US" ? "4.30 lb" : "1950.4 g",
      "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "cat"
    },
    {
      "size": "Pineapple",
      "length": countryCode() === "US" ? "17.04 in" : "43.3 cm",
      "weight": countryCode() === "US" ? "3.81 lb" : "1728.2 g",
      "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "Seat height of a chair"
    },
    {
      "size": "Cabbage",
      "length": countryCode() === "US" ? "16.34 in" : "41.5 cm",
      "weight": countryCode() === "US" ? "3.35 lb" : "1519.5 g",
      "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "Seat height of a chair"
    },
    {
      "size": "Cauliflower",
      "length": countryCode() === "US" ? "15.89 in" : "40.4 cm",
      "weight": countryCode() === "US" ? "2.94 lb" : "1333.6 g",
      "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "Seat height of a chair"
    },
    {
      "size": "Spaghetti squash",
      "length": countryCode() === "US" ? "15.51 in" : "39.4 cm",
      "weight": countryCode() === "US" ? "2.57 lb" : "1165.7 g",
      "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "Seat height of a chair"
    },
    {
      "size": "Eggplant",
      "length": countryCode() === "US" ? "14.99 in" : "38.1 cm",
      "weight": countryCode() === "US" ? "2.29 lb" : "1038.7 g",
      "icon": <SoftDrinkIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "2L/0.5gal soft drink bottle"
    },
    {
      "size": "Cantaloupe",
      "length": countryCode() === "US" ? "14.68 in" : "37.3 cm",
      "weight": countryCode() === "US" ? "1.95 lb" : "884.5 g",
      "icon": <SoftDrinkIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "2L/0.5gal soft drink bottle"
    },
    {
      "size": "Broccoli",
      "length": countryCode() === "US" ? "13.98 in" : "35.5 cm",
      "weight": countryCode() === "US" ? "1.60 lb" : "725.7 g",
      "icon": <LaptopIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "laptop"
    },
    {
      "size": "Papaya",
      "length": countryCode() === "US" ? "12.93 in" : "32.8 cm",
      "weight": countryCode() === "US" ? "1.49 lb" : "675.9 g",
      "icon": <LaptopIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "laptop"
    },
    {
      "size": "Coconut",
      "length": countryCode() === "US" ? "12.02 in" : "30.5 cm",
      "weight": countryCode() === "US" ? "1.39 lb" : "630.5 g",
      "icon": <MagazineIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "magayine"
    },
    {
      "size": "Grapefruit",
      "length": countryCode() === "US" ? "11.49 in" : "29.2 cm",
      "weight": countryCode() === "US" ? "1.13 lb" : "512.6 g",
      "icon": <MagazineIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "magayine"
    },
    {
      "size": "Jicama",
      "length": countryCode() === "US" ? "11.03 in" : "28 cm",
      "weight": countryCode() === "US" ? "15.32 oz" : "434.3 g",
      "icon": <SpaghettiIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "spaghetti"
    },
    {
      "size": "Mango",
      "length": countryCode() === "US" ? "10.68 in" : "27.1 cm",
      "weight": countryCode() === "US" ? "12.9 oz" : "365.7 g",
      "icon": <SpaghettiIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "spaghetti"
    },
    {
      "size": "Pomegranate",
      "length": countryCode() === "US" ? "6.60 in" : "26 cm",
      "weight": countryCode() === "US" ? "10.69 oz" : "303.1 g",
      "icon": <KitchenPaperIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "kitchen paper roll"
    },
    {
      "size": "Onion",
      "length": countryCode() === "US" ? "6.17 in" : "15.7 cm",
      "weight": countryCode() === "US" ? "8.58 oz" : "243.2 g",
      "icon": <SmartPhoneIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "smartphone"
    },
    {
      "size": "Orange",
      "length": countryCode() === "US" ? "5.67 in" : "14.4 cm",
      "weight": countryCode() === "US" ? "6.03 oz" : "170.9 g",
      "icon": <PencilIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "pen"
    },
    {
      "size": "Apple",
      "length": countryCode() === "US" ? "5.25 in" : "13.3 cm",
      "weight": countryCode() === "US" ? "5.04 oz" : "142.3 g",
      "icon": <HandCreamIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "hand cream"
    },
    {
      "size": "Avocado",
      "length": countryCode() === "US" ? "4.69 in" : "11.9 cm",
      "weight": countryCode() === "US" ? "3.66 oz" : "103.8 g",
      "icon": <PopsicleIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "popsicle"
    },
    {
      "size": "PPeach",
      "length": countryCode() === "US" ? "4.17 in" : "10.59 cm",
      "weight": countryCode() === "US" ? "2.56 oz" : "72.6 g",
      "icon": <HighlighterIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "highlighter"
    },
    {
      "size": "Lemon",
      "length": countryCode() === "US" ? "3.51 in" : "8.92 cm",
      "weight": countryCode() === "US" ? "1.60 oz" : "45.4 g",
      "icon": <CreditCardIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "credit card"
    },
    {
      "size": "Plum",
      "length": countryCode() === "US" ? "3.0 in" : "7.62 cm",
      "weight": countryCode() === "US" ? "0.9 oz" : "25.5 g",
      "icon": <NailPolishIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "nail polish"
    },
    {
      "size": "Lime",
      "length": countryCode() === "US" ? "2.3 in" : "5.8 cm",
      "weight": countryCode() === "US" ? "0.51 oz" : "14.4 g",
      "icon": <LipStickIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "lipstick"
    },
    {
      "size": "Apricot",
      "length": countryCode() === "US" ? "1.7 in" : "4.3 cm",
      "weight": countryCode() === "US" ? "0.28 oz" : "7.9 g",
      "icon": <HairpinIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "hairpin"
    },
    {
      "size": "Strawberry",
      "length": countryCode() === "US" ? "1.20 in" : "3 cm",
      "weight": countryCode() === "US" ? "0.13 oz" : "3.7 g",
      "icon": <EarPhonesIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "earphone"
    },
    {
      "size": "Cherry",
      "length": countryCode() === "US" ? "0.80 in" : "2 cm",
      "weight": countryCode() === "US" ? "0.07 oz" : "2 g",
      "icon": <ButtonIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "button"
    },
    {
      "size": "Raspberry",
      "length": countryCode() === "US" ? "0.58 in" : "1.5 cm",
      "weight": countryCode() === "US" ? "0.04 oz" : "1 g",
      "icon": <FingerNailIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "finger nail"
    },
    {
      "size": "Blueberry",
      "length": countryCode() === "US" ? "0.31 in" : "0.79 cm",
      "weight": countryCode() === "US" ? "0.02 oz" : "0.5 g",
      "icon": <LadyBugIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "lady bug"
    },
    {
      "size": "Raisin",
      "length": countryCode() === "US" ? "0.15 in" : "0.38 cm",
      "weight": countryCode() === "US" ? "0.01 oz" : "0.28 g",
      "icon": <RiceIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "rice"
    },
    {
      "size": "Sunflower seed",
      "length": countryCode() === "US" ? "0.09 in" : "0.23 cm",
      "weight": countryCode() === "US" ? "0.007 oz" : "0.19 g",
      "icon": <SunFlowerFeedIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "linen seed"
    },
    {
      "size": "Sesame seed",
      "length": countryCode() === "US" ? "0.05 in" : "0.13 cm",
      "weight": countryCode() === "US" ? "0.004 oz" : "0.11 g",
      "icon": <ChiaSeedIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "chia seed"
    },
    {
      "size": "Poppy seed",
      "length": countryCode() === "US" ? "0.03 in" : "0.08 cm",
      "weight": countryCode() === "US" ? "0.002 oz" : "0.06 g",
      "icon": <SnowCrystalIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
      "good_ones": "snow crystal"
    },
    {
      "size": " ",
      "length": " ",
      "weight": " ",
      "good_ones": " "
    },
    {
      "size": " ",
      "length": " ",
      "weight": " ",
      "good_ones": " "
    },
    {
      "size": " ",
      "length": " ",
      "weight": " ",
      "good_ones": " "
    },
  ]
}

export default BabySize
