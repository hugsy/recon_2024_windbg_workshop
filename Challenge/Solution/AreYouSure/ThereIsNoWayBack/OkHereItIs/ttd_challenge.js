/// @ts-check
///
/// <reference path="../extra/JSProvider.d.ts" />
///
/// Run the script using `.scriptrun \path\to\ttd_challenge.js`
///
/// @links
/// - https://aka.ms/JsDbgExt
///
"use strict";

function invokeScript() {
    // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-lbuttondown
    const WM_MOUSEMOVE = 0x0200;
    const MK_LBUTTON_PARAM = 0x0001;
    const GETMESSAGE_FUNCNAME = "USER32!GETMESSAGEW";

    let filepath = host.namespace.Debugger.Utility.FileSystem.TempDirectory + "\\ttd.csv";
    let hfile = host.namespace.Debugger.Utility.FileSystem.CreateFile(filepath, "CreateAlways");
    let writer = host.namespace.Debugger.Utility.FileSystem.CreateTextWriter(hfile);
    writer.WriteLine(`x, y`);

    // Enumerate the calls to USER32!GETMESSAGEW and discard the failed ones
    let calls = cursession().TTD.Calls(GETMESSAGE_FUNCNAME).Where(e => e.ReturnValue == 1);
    ok(`found ${calls.Count()} calls to ${GETMESSAGE_FUNCNAME}`);

    log(`Collecting window message values, this loop may take a few minutes to finish...`);

    // For each call, we want to:
    for (let call of calls) {
        // 1. collect the [out] `message` address
        let addr = call.Parameters[0];

        // 2. jump to the return address so the value is populated
        call.TimeEnd.SeekTo();

        // 3. convert the object to its corresponding type (`wintypes!MSG`)
        let msg = host.createTypedObject(addr, "wintypes", "MSG");

        // 4. discard if not a mouse mouvement message, or if the left button was not pressed
        if (!(msg.message == WM_MOUSEMOVE && (msg.wParam & MK_LBUTTON_PARAM) != 0))
            continue;

        // 5. Write the coordinates (x, y) in a CSV file
        // Note: y axis is inversed, flip it back manually by making it negative
        writer.WriteLine(`${msg.pt.x}, -${msg.pt.y}`);
    }

    hfile.Close();
    ok(`Written as ${filepath}`);

    // Open the file in Excel/gCalc and plot the graph as a scatter line
    // Or use drawing libraries, like PIL, to render the plot from the coordinates
    // You can see the message: Happy REcon !
}


function initializeScript() {
    return [
        new host.apiVersionSupport(1, 9),
    ];
}



function uninitializeScript() {
}









Object.prototype.toString = function () { if (this["__Name"] !== undefined) { return `${this["__Name"]}` }; if (this["__Path"] !== undefined) { return `${this["__Path"]}` }; return ``; };

/**
 * @param {string} x
 */
const log = x => host.diagnostics.debugLog(`${x}\n`);
/**
 *
 * @param {string} x
 */
const ok = x => log(`[+] ${x}`);
/**
 * @param {string} x
 */
const warn = x => log(`[!] ${x}`);
/**
 * @param {string} x
 */
const err = x => log(`[-] ${x}`);
/**
 * Returns a hex string of the number
 * @param {host.Int64} x
 * @returns {string}
 */
const hex = x => x.toString(16);
/**
 *
 * @param {string} x
 * @returns {host.Int64}
 */
const i64 = x => host.parseInt64(x);
/**
 * Execute the WinDbg command
 * @param {string} x
 * @returns {any}
 */
const system = x => host.namespace.Debugger.Utility.Control.ExecuteCommand(x);
/**
 * Return the sizeof the structure `y` in module `x`
 * @param {string} x
 * @param {string} y
 * @returns {host.Int64}
 */
const sizeof = (x, y) => host.getModuleType(x, y).size;
/**
 * Return the offset of the field `n` in the structure `t`
 * @param {string} t
 * @param {string} n
 * @returns {number}
 */
const FIELD_OFFSET = (t, n) => parseInt(system(`?? #FIELD_OFFSET(${t}, ${n})`).First().split(" ")[1].replace("0n", ""));
/**
 * Return the base address of the structure with a field at address `a`, of type `n` in the module `t`
 * @param {host.Int64} a
 * @param {string} t
 * @param {string} n
 * @returns {host.Int64}
 */
const CONTAINING_RECORD = (a, t, n) => a.add(-FIELD_OFFSET(t, n));

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function read8(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.readMemoryValues(x, 1, 1)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function read16(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.readMemoryValues(x, 1, 2)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function read32(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.readMemoryValues(x, 1, 4)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function read64(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.readMemoryValues(x, 1, 8)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function write8(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.writeMemoryValues(x, 1, 1)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function write16(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.writeMemoryValues(x, 1, 2)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function write32(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.writeMemoryValues(x, 1, 4)[0]; }

/**
 *
 * @param {number} x
 * @param {boolean} phy
 * @returns {host.Int64}
 */
function write64(x, phy = false) { if (phy) { x = host.memory.physicalAddress(x); } return host.memory.writeMemoryValues(x, 1, 8)[0]; }

/**
 * @returns {sessionInterface}
 */
function cursession() { return host.namespace.Debugger.State.DebuggerVariables.cursession; }

/**
 * @returns {processInterface}
 */
function curprocess() { return host.namespace.Debugger.State.DebuggerVariables.curprocess; }

/**
 * @returns {threadInterface}
 */
function curthread() { return host.namespace.Debugger.State.DebuggerVariables.curthread; }

/**
 * @returns {number}
 */
function ptrsize() { return cursession().Attributes.Machine.PointerSize; }

/**
 * @returns {number}
 */
function pagesize() { return cursession().Attributes.Machine.PageSize; }

/**
 * @returns {boolean}
 */
function is64b() { return ptrsize() === 8; }

/**
 * @returns {boolean}
 */
function isKd() { return cursession().Attributes.Target.IsKernelTarget === true; }

/**
 * @param {string} r
 * @returns {any}
 */
function $(r) { return isKd() ? curthread().Registers.User[r] || curthread().Registers.Kernel[r] : curthread().Registers.User[r]; }

/**
 * @param {host.Int64} x
 * @returns {symbolInformationInterface}
 */
function get_symbol(x) { return host.getModuleContainingSymbolInformation(x); }

/**
 * @param {number} x
 * @returns {host.Int64}
 */
function poi(x) { return is64b() ? read64(x) : read32(x); }

/**
 *
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message = "") { if (!condition) { throw new Error(`Assertion failed ${message}`); } }

