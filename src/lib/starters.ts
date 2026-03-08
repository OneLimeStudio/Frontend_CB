/**
 * Per-problem function starters, keyed by exact problem title.
 * Falls back to DEFAULT_STARTERS if no match found.
 */
export const PROBLEM_STARTERS: Record<string, Record<string, string>> = {
  "Two Sum": {
    python: `def solve(nums, target):\n    # Return indices of two numbers that add up to target\n    pass\n`,
    javascript: `function solve(nums, target) {\n    // Return indices of two numbers that add up to target\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Two Sum\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Two Sum\n    }\n}\n`,
  },
  "Valid Palindrome": {
    python: `def solve(s):\n    # Return true if s is a palindrome (alphanumeric only, case-insensitive)\n    pass\n`,
    javascript: `function solve(s) {\n    // Return true if s is a palindrome\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Valid Palindrome\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Valid Palindrome\n    }\n}\n`,
  },
  "Maximum Subarray": {
    python: `def solve(nums):\n    # Return the largest sum of any contiguous subarray\n    pass\n`,
    javascript: `function solve(nums) {\n    // Return the largest sum of any contiguous subarray\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Maximum Subarray\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Maximum Subarray\n    }\n}\n`,
  },
  "Valid Parentheses": {
    python: `def solve(s):\n    # Return true if the bracket string is valid\n    pass\n`,
    javascript: `function solve(s) {\n    // Return true if the bracket string is valid\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Valid Parentheses\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Valid Parentheses\n    }\n}\n`,
  },
  "Reverse Linked List": {
    python: `def solve(head):\n    # Reverse a singly linked list, return new head\n    pass\n`,
    javascript: `function solve(head) {\n    // Reverse a singly linked list, return new head\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct ListNode { int val; ListNode* next; };\n\nListNode* solve(ListNode* head) {\n    // Reverse linked list\n    return nullptr;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Reverse Linked List\n    }\n}\n`,
  },
  "Binary Search": {
    python: `def solve(nums, target):\n    # Return index of target in sorted array, or -1\n    pass\n`,
    javascript: `function solve(nums, target) {\n    // Return index of target in sorted array, or -1\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Binary Search\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Binary Search\n    }\n}\n`,
  },
  "FizzBuzz": {
    python: `def solve(n):\n    # Return list of FizzBuzz strings from 1 to n\n    pass\n`,
    javascript: `function solve(n) {\n    // Return array of FizzBuzz strings from 1 to n\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // FizzBuzz\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // FizzBuzz\n    }\n}\n`,
  },
  "Contains Duplicate": {
    python: `def solve(nums):\n    # Return true if any value appears more than once\n    pass\n`,
    javascript: `function solve(nums) {\n    // Return true if any value appears more than once\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Contains Duplicate\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Contains Duplicate\n    }\n}\n`,
  },
  "Climbing Stairs": {
    python: `def solve(n):\n    # Count distinct ways to climb n stairs (1 or 2 steps at a time)\n    pass\n`,
    javascript: `function solve(n) {\n    // Count distinct ways to climb n stairs (1 or 2 steps at a time)\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Climbing Stairs\n    return 0;\n}\n`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Climbing Stairs\n    }\n}\n`,
  },
};

export const DEFAULT_STARTERS: Record<string, string> = {
  python: `def solve():\n    # You can name this function anything\n    pass\n`,
  javascript: `function solve() {\n    // You can name this function anything\n}\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
  java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n`,
};

/**
 * Returns the appropriate starter code for a given problem title and language.
 * Uses per-problem signature if available, otherwise falls back to the default.
 */
export function getStarter(title: string, lang: string): string {
  return (PROBLEM_STARTERS[title] ?? DEFAULT_STARTERS)[lang] ?? DEFAULT_STARTERS[lang] ?? "";
}

export const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];
