"use client"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export default function TestNavPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Navigation Menu Test</h1>
      
      {/* Test 1: Basic NavigationMenu */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 1: Basic Navigation Menu</h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Test Dropdown</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-2 p-4 w-[400px]">
                  <ul className="grid grid-cols-2 gap-2">
                    <li><NavigationMenuLink href="/test1">Test Link 1</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test2">Test Link 2</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test3">Test Link 3</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test4">Test Link 4</NavigationMenuLink></li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink href="/simple">Simple Link</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Test 2: NavigationMenu without viewport */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 2: Navigation Menu without Viewport</h2>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>No Viewport Dropdown</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-2 p-4 w-[400px] bg-white border rounded shadow">
                  <ul className="grid grid-cols-2 gap-2">
                    <li><NavigationMenuLink href="/test1">Test Link 1</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test2">Test Link 2</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test3">Test Link 3</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test4">Test Link 4</NavigationMenuLink></li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Test 3: Simple styled dropdown */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 3: Styled Navigation Menu</h2>
        <NavigationMenu className="bg-blue-600 text-white p-2 rounded">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-blue-600 text-white hover:bg-blue-700">
                Styled Dropdown
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-2 p-4 w-[400px]">
                  <ul className="grid grid-cols-2 gap-2">
                    <li><NavigationMenuLink href="/test1" className="text-blue-600 hover:text-blue-800">Test Link 1</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test2" className="text-blue-600 hover:text-blue-800">Test Link 2</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test3" className="text-blue-600 hover:text-blue-800">Test Link 3</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/test4" className="text-blue-600 hover:text-blue-800">Test Link 4</NavigationMenuLink></li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}