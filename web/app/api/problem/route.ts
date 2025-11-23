import { NextResponse } from "next/server";

export async function GET() {
  const max_variable = 11;
  const a = Math.floor(Math.random() * max_variable) + 1;
  const b = Math.floor(Math.random() * max_variable) + 1;
  // c range is [b, max_variable] inclusive
  const c = Math.floor(Math.random() * (max_variable - b + 1)) + b;

  const gcd = (x: number, y: number): number => {
    // Standard Euclidean algorithm
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      [x, y] = [y, x % y];
    }
    return x;
  };

  const diff = c - b;
  const divisor = gcd(diff, a);
  
  let x: string;
  if (diff === 0) {
    x = "0";
  } else {
    const numerator = diff / divisor;
    const denominator = a / divisor;
    
    if (denominator === 1) {
      x = `${numerator}`;
    } else {
      x = `${numerator}/${denominator}`;
    }
  }

  const problem = `$${a}x + ${b} = ${c}$`;
  const solution = `$${x}$`;

  return NextResponse.json({ problem, solution });
}

