cmake_minimum_required(VERSION 3.26)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_INTERPROCEDURAL_OPTIMIZATION True)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/cmake")

project(
    WindbgExt
    DESCRIPTION "WindbgExt"
    HOMEPAGE_URL https://github.com/hugsy/WindbgExt
)

set(PROJECT_AUTHOR hugsy)
set(PROJECT_LICENSE MIT)

set(CXX_STANDARD 23)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)

set(PROJECT_ROOT_DIR ${CMAKE_CURRENT_LIST_DIR})

add_subdirectory(src)
