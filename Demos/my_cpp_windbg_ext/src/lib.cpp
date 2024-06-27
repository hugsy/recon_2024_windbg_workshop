// clang-format off
#include <windows.h>
#include <wdbgexts.h>
#include <dbgeng.h>
// clang-format on

#include <wil/com.h>

#include "constants.hpp"

EXTERN_C_START
__declspec(dllexport) ULONG CALLBACK
DebugExtensionInitialize(PULONG Version, PULONG Flags)
{
    *Version = DEBUG_EXTENSION_VERSION(Info::Version::Major, Info::Version::Minor);
    *Flags   = 0;
    return S_OK;
}

__declspec(dllexport) void CALLBACK
DebugExtensionUninitialize()
{
}

__declspec(dllexport) HRESULT CALLBACK
DebugExtensionCanUnload()
{
    return S_OK;
}

__declspec(dllexport) void CALLBACK
my_ext(PDEBUG_CLIENT Client, PCSTR args)
{
    auto cli = wil::com_ptr(Client);
    if ( !cli )
        return;

    auto dbg = cli.try_query<IDebugClient>();
    if ( !dbg )
        return;

    auto ctl = dbg.try_query<IDebugControl>();
    if ( !ctl )
        return;

    ctl->Output(DEBUG_OUTPUT_NORMAL, "hello from my_ext\n");
}


EXTERN_C_END

BOOL WINAPI
DllMain(HINSTANCE hInstance, DWORD dwReason, LPVOID lpReserved)
{
    switch ( dwReason )
    {
    case DLL_PROCESS_ATTACH:
        // Disables the DLL_THREAD_ATTACH and DLL_THREAD_DETACH notifications for the specified dynamic-link library
        // (DLL)
        ::DisableThreadLibraryCalls(hInstance);
        break;
    case DLL_PROCESS_DETACH:
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
        break;
    }
    return TRUE;
}
