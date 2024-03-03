const config = {
    screens: {
        MyBabyScreen: "MyBabyScreen",
        ArticleDetailsScreen: { 
            path: "articleDetails/:id",
            parse: { id: (id) => `${id}`}
        }
    }
}

const linking = {
    prefixes: ["medelaFamily://app"],
    config
}

export default linking;