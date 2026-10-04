#!/usr/bin/env python3
"""
Automated smoke test for SEO Destroyer Pro.
Tests page load, interaction, destruction scan, results rendering, and CLI mode toggle.
"""

import sys
import time
from playwright.sync_api import sync_playwright

def run():
    print(">>> Starting Playwright smoke test against http://localhost:5179 ...")
    errors = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Listen for console errors
        def on_console(msg):
            if msg.type == "error":
                errors.append(f"Console error: {msg.text}")
        
        def on_pageerror(err):
            errors.append(f"Page error: {str(err)}")
            
        page.on("console", on_console)
        page.on("pageerror", on_pageerror)
        
        # 1. Navigate
        page.goto("http://localhost:5179/", wait_until="networkidle")
        title = page.title()
        print(f"Page Title: {title}")
        assert "SEO Destroyer Pro" in title, f"Unexpected title: {title}"
        
        # 2. Check header and landmarks
        header = page.locator("header")
        assert header.is_visible(), "Header landmark not visible"
        main = page.locator("main#main-content")
        assert main.is_visible(), "Main landmark not visible"
        
        # 3. Enter target URL
        input_box = page.locator('input[placeholder*="your-website.com"]')
        assert input_box.is_visible(), "Target URL input not visible"
        input_box.fill("https://test-site-to-destroy.org")
        
        # 4. Trigger destruction
        destroy_btn = page.locator('button:has-text("DESTROY SEO")')
        assert destroy_btn.is_visible(), "Destroy button not visible"
        destroy_btn.click()
        print("Clicked DESTROY SEO, waiting for destruction scan...")
        
        # 5. Wait for results phase (terminal completes and results appear)
        print("Waiting for phase scanning to complete...")
        try:
            # Check if scanning terminal appeared
            page.wait_for_selector('text=DESTROYING...', timeout=3000)
            print("Scan initiated (button shows DESTROYING...)")
        except Exception as e:
            print(f"Notice: button state change not caught: {e}")

        # Terminal lines: 14 lines * 200ms = 2.8s, then 18 metrics * 180ms = 3.24s. Total ~6-8s.
        try:
            page.wait_for_selector('text=OVERALL SEO DESTRUCTION SCORE', timeout=20000)
            print("Results phase reached successfully!")
        except Exception as err:
            page.screenshot(path="smoke-debug.png")
            print("Failed to find OVERALL SEO DESTRUCTION SCORE. Saved smoke-debug.png")
            print("Errors recorded:", errors)
            print("Current page text snippet:", repr(page.inner_text("body")[:500]))
            raise err
        
        # 6. Check Reverse Lighthouse Report
        lighthouse = page.locator('text=REVERSE LIGHTHOUSE REPORT')
        assert lighthouse.is_visible(), "Reverse Lighthouse Report not visible"
        
        # 7. Check Search Console
        sc = page.locator('text=SEARCH CONSOLE DESTRUCTION')
        assert sc.is_visible(), "Search Console section not visible"
        
        # 8. Check canvas chart
        canvas = page.locator('canvas')
        assert canvas.count() >= 1, "Canvas chart not rendered"
        
        # 9. Test CLI mode toggle
        cli_btn = page.locator('button:has-text("CLI MODE")')
        if cli_btn.is_visible():
            cli_btn.click()
            time.sleep(0.3)
            print("CLI mode toggled successfully!")
            cli_on = page.locator('button:has-text("CLI MODE ON")')
            assert cli_on.is_visible(), "CLI mode toggle failed"
            # Toggle back
            cli_on.click()
            time.sleep(0.2)
            
        # 10. Check for unexpected errors
        filtered_errors = [e for e in errors if "favicon" not in e.lower()]
        if filtered_errors:
            print(f"FAILED with console errors: {filtered_errors}")
            browser.close()
            sys.exit(1)
            
        print(">>> ALL SMOKE CHECKS PASSED WITH 0 CONSOLE ERRORS!")
        browser.close()

if __name__ == "__main__":
    run()
