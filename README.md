# REcon 2024 - Tips & Tricks for better debugging with WinDbg

This repository contains the materials created for the workshop "Tips & Tricks for better debugging with WinDbg", at [REcon 2024](https://cfp.recon.cx/recon2024/talk/GK8YDV/).

## Setup

The workshop materials aims to provide useful features for WinDbg, when debugging in kernel-mode, but whose concepts can very well be applied to user-mode debugging.

To easily setup a KdNet environment, it is possible to:
 - create a Windows VM, set it up using `bcdedit /dbgsettings`
 - use WindowsSandbox
```pwsh
Enable-WindowsOptionalFeature -All -Online -LimitAccess -FeatureName Microsoft-Hyper-V # optional
Enable-WindowsOptionalFeature -All -Online -FeatureName Containers-DisposableClientVM # optional
CmDiag.exe DevelopmentMode -On 
CmDiag.exe Debug -on –net –hostip $LocalHostIP –key 1.2.3.4
```
  - or use LKD on your host, if you can enable the debug mode (`bcdedit /set {current} debug on`)

## Slides

The slides from the workshop are available here:
 - [Slides](https://github.com/hugsy/recon_2024_windbg_workshop/blob/main/Tips%20Tricks%20for%20better%20debugging%20with%20WinDbg.pdf)

A WinDbg cheatsheet can also be found here:
  - [Cheatsheet](https://github.com/hugsy/defcon_27_windbg_workshop/blob/main/windbg_cheatsheet.md)

## Demos

The folder `Demos` hold some code developed as part of and illustrated during the workshop.

## Challenge

The workshop finished on a challenge, containing a TTD trace which can be opened using WinDbg.
The task consisted in discovering what was being done during the TTD session, and answering (among others) to the following questions:
 - Which process is being debugged ?
 - Which API are being used the most ?
 - What is the "final message" in the trace ?

All steps can (should) be entirely under WinDbg.

The solution script can be found in the same folder.

## Contact

This repository will be left on Github, but archived. If you have questions, feel free to reach out to me on [Twitter/X](https://x.com/_hugsy_), or [Discord](https://discord.gg/hSbqxxBgRX)
