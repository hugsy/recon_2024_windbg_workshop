project(WindbgExt
        LANGUAGES CXX
        VERSION 0.1.0)

set(PROJECT_LIB_SRC_DIR ${PROJECT_ROOT_DIR}/src CACHE INTERNAL "PROJECT_LIB_SRC_DIR")

configure_file(
    "${PROJECT_LIB_SRC_DIR}/constants.hpp.in"
    "${PROJECT_LIB_SRC_DIR}/constants.hpp"
    NEWLINE_STYLE WIN32
)

include(FetchContent)

set(FAST_BUILD ON)
set(WIL_BUILD_PACKAGING OFF)
set(WIL_BUILD_TESTS OFF)

FetchContent_Declare(
    WIL
    GIT_REPOSITORY https://github.com/microsoft/wil.git
    GIT_TAG v1.0.240122.1
)

FetchContent_MakeAvailable(WIL)

message(STATUS "CMAKE_MODULE_PATH:                 ${CMAKE_MODULE_PATH}")
message(STATUS "CMAKE_SYSTEM_PROCESSOR:            ${CMAKE_SYSTEM_PROCESSOR}")
message(STATUS "CMAKE_SYSTEM_NAME:                 ${CMAKE_SYSTEM_NAME}")

add_library(${PROJECT_NAME} SHARED lib.cpp)
target_link_libraries(${PROJECT_NAME} PRIVATE WIL)

install(TARGETS ${PROJECT_NAME} DESTINATION ${PROJECT_NAME}/Library)

