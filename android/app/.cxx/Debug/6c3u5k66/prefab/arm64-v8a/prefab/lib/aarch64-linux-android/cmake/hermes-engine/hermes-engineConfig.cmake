if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/sanugupta/.gradle/caches/8.13/transforms/c2012a073284d34c34a2e49c32788707/transformed/hermes-android-0.81.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sanugupta/.gradle/caches/8.13/transforms/c2012a073284d34c34a2e49c32788707/transformed/hermes-android-0.81.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

