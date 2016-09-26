export_env_dir() {
    env_dir=$1
    whitelist_regex=${2:-''}
    blacklist_regex=${3:-'^(PATH|GIT_DIR|CPATH|CPPATH|LD_PRELOAD|LIBRARY_PATH)$'}
    if [ -d "$env_dir" ]; then
        for e in $(ls $env_dir); do
            echo e &&
            echo "$e" | grep -E "$whitelist_regex" | grep -qvE "$blacklist_regex" &&
                export "$e=$(cat $env_dir/$e)"
            :
        done
    fi
}
export_env_dir $ENV_DIR
npm install
npm run build-storybook
