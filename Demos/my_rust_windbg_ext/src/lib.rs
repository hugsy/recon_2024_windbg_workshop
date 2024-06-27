use dbgeng::client::DebugClient;
use dbgeng::dlogln;
use windows::core::{IUnknown, Interface, HRESULT, PCSTR};
use windows::Win32::Foundation::{E_ABORT, S_OK};

pub type RawIUnknown = *mut core::ffi::c_void;

#[no_mangle]
extern "C" fn DebugExtensionInitialize(_version: *mut u32, _flags: *mut u32) -> HRESULT {
    S_OK
}

#[no_mangle]
extern "C" fn DebugExtensionUninitialize() {}

#[no_mangle]
extern "C" fn my_ext(raw_client: RawIUnknown, _args: PCSTR) -> HRESULT {
    let Some(client) = (unsafe { IUnknown::from_raw_borrowed(&raw_client) }) else {
        return E_ABORT;
    };

    let Ok(dbg) = DebugClient::new(client) else {
        return E_ABORT;
    };

    let _ = dlogln!(dbg, "running `my_ext`");

    S_OK
}
