# Infliating Contributions Investment Calculator
Most investment calculators on the internet let you choose a single amount you are going to contribute repeatedly for the entire term. However, $1,000 invested today will be worth more than $1,000 invested 10 years from now. What if you wanted to scale your investments over time to account for that inflation? What would your investment portfolio be worth?

This is where the <ins>Inflating Contributions Investment Formula (ICIF)</ins> comes in. It calculates what your portfolio would be worth when the amount you are contributing into a fund slowly increases. This could be used to account for inflation, or it could be used to represent how a salary progression allows you to invest more as time progresses.

This formula is: \
$$A=c\left(\frac{\left(\left(1+\frac{r}{n}\right)^{\left(nt+1\right)}-\left(1+\frac{i}{n}\right)^{\left(nt+1\right)}\right)}{\left(1+\frac{r}{n}\right)-\left(1+\frac{i}{n}\right)}-\left(1+\frac{i}{n}\right)^{nt}\right)$$ \
where:
- \\(A\\) = The total amount of money at the end of the investment term in dollars
- \\(c\\) = The amount of the very first contribution in dollars
- \\(r\\) = The rate of interest on investments (1% increase = 0.01)
- \\(i\\) = The rate of inflation (1% increase = 0.01)
- \\(t\\) = The duration of the investment term in years
- \\(n\\) = The number of times a contribution will be made per year

## Deriving the Formula

The total amount of money of the investment fund is simply a sum of every contribution multiplied by the compound interest each one gained during the investment term. In other words: \\(c\cdot r^{t}\\).

When summed, the equation would be:\
$$\sum_{k=0}^{t}\left(c\cdot r^{\left(t-k\right)}\right)$$

\\((t-k)\\) is decreasing because the later a contribution is made, the less time it has to accumulate compound interest.

The contributions must be made with additional compound interest, this time in the form of inflation, which would look like \\(c\cdot i^{t}\\).

When summed, this equation would be:\
$$\sum_{k=0}^{t}\left(c\cdot i^{\left(k\right)}\right)$$ \
This time, \\(t\\) increases because the later contributions are made, the more inflation it must compensate.

Putting the two summations together, you get: \
$$\sum_{k=0}^{t}\left(c\cdot r^{\left(t-k\right)}i^{\left(k\right)}\right)$$

When the summation is expanded and the coefficient is factored out, you get:\
$$c\left(r^{t}i^{0}+r^{\left(t-1\right)}i^{1}+r^{\left(t-2\right)}i^{2}+...+r^{2}i^{\left(t-2\right)}+r^{1}i^{\left(t-1\right)}+r^{0}i^{t}\right)$$

There is a very similar bivariate polynomial that looks like this:\
$$(x^{\left(n-1\right)}y^{0}+x^{\left(n-2\right)}y^{1}+x^{\left(n-3\right)}y^{2}+...+x^{2}y^{\left(n-3\right)}+x^{1}y^{\left(n-2\right)}+x^{0}y^{\left(n-1\right)})$$

The cool thing about that polynomial is that if you multiply the entire series by \\((x-y)\\), it collapses into a very brief expression:\
$$\left(x^{n}-y^{n}\right)=\left(x-y\right)\left(x^{\left(n-1\right)}y^{0}+x^{\left(n-2\right)}y^{1}+x^{\left(n-3\right)}y^{2}+...+x^{2}y^{\left(n-3\right)}+x^{1}y^{\left(n-2\right)}+x^{0}y^{\left(n-1\right)}\right)$$

Working the other way, the polynomial can be represented as: \
$$\left(\frac{x^{n}-y^{n}}{x-y}\right)$$

This isn't exactly what we need, though. The polynomial in the equation is reduced one power since \\(x\\) starts at \\((n-1)\\). To account for this, the equation we need should have \\((n+1)\\): \
$$\left(\frac{x^{\left(n+1\right)}-y^{\left(n+1\right)}}{x-y}\right)$$

However, this new equation will have the term \\((x^{0}y^{\left(n-1\right)})\\). Since this term experiences no compound interest and only inflation, it should be removed.

The current equation will look like: \
$$\left(\frac{x^{\left(n+1\right)}-y^{\left(n+1\right)}}{x-y}-y^{n}\right)$$

If you plug back in our variables and contribution, you get:\
$$A=c\left(\frac{r^{\left(t+1\right)}-i^{\left(t+1\right)}}{r-i}-i^{t}\right)$$

And if we flip the equation, we can extrapolate a contribution amount given a final investment target:\
$$c=\frac{A}{\left(\frac{r^{\left(t+1\right)}-i^{\left(t+1\right)}}{r-i}-i^{t}\right)}$$

However, using this formula only gives the contribution amount for an entire year. What if you wanted to find out how much to contribute multiple times a year? Simple. Like the discrete coumpound interest formula, \\(A=P\left(1+\frac{r}{n}\right)^{nt}\\), you need to turn \\(t\\) into \\(nt\\), which gives you the total number of subannual terms. Additionally, you need to account for the \\(r\\) and \\(i\\) growth rates, so they will reduce to \\(\left(1+\frac{r}{n}\right)\\) and \\(\left(1+\frac{i}{n}\right)\\) respectively.

When factoring those in, we get:\
$$A=c\left(\frac{\left(\left(1+\frac{r}{n}\right)^{\left(nt+1\right)}-\left(1+\frac{i}{n}\right)^{\left(nt+1\right)}\right)}{\left(1+\frac{r}{n}\right)-\left(1+\frac{i}{n}\right)}-\left(1+\frac{i}{n}\right)^{nt}\right)$$ \
This formula quickly calculates a final A value when given a starting contribution. Flipping it will get:\
$$c=A/\left(\frac{\left(\left(1+\frac{r}{n}\right)^{\left(nt+1\right)}-\left(1+\frac{i}{n}\right)^{\left(nt+1\right)}\right)}{\left(1+\frac{r}{n}\right)-\left(1+\frac{i}{n}\right)}-\left(1+\frac{i}{n}\right)^{nt}\right)$$ \
This formula finds the amount of the very first contribution given a final target for an investment fund.

Converting this formula back into a summation will give:\
$$c\sum_{k=0}^{nt-1}\left(1+\frac{i}{n}\right)^{\left(k\right)}\left(1+\frac{r}{n}\right)^{\left(nt-k\right)}$$
This formula will be useful when tabulating the accumulated investment fund over time, since you will need the sum after each term. Note that the values of \\(k\\) will be offset by one, since \\(k=0\\) is used for term \\(1\\).

However, when getting the contribution amount, the compound interest on investments will not be needed, only the inflation. Therefore, another equation is needed without it. \
$$\sum_{k=0}^{nt-1}c\left(1+\frac{i}{n}\right)^{\left(k\right)}$$ \
This formula will help find the accumulated principle value of money you have contributed to the fund so far.

We will also need an equation that will give the individual contribution values and not an accumulated sum, so the formula will be made into a sequence.
$$c_{k}=c\left(1+\frac{i}{n}\right)^{\left(k\right)}$$ \
This formula will be used to calculate how much you need to contribute into your investment fund for every term.

Collectively, these final five equations will allow the program to tabulate for each term:
1. The amount of money you will need to contribute.
2. The total amount of money you have contributed so far.
3. The current size of your fund including investment returns

<hr>

There is one thing that main equation has not accounted for yet—what happens when \\(r\\) and \\(i\\) are the same value?

When plugging the values into the equation at the beginning, the denomenator becomes \\(0\\), which makes the function undefined. Therefore, we need a new function specifically for when \\(r=i\\). 

Lets first bring back the expanded and factored summation at the beginning:
$$c\left(r^{t}i^{0}+r^{\left(t-1\right)}i^{1}+r^{\left(t-2\right)}i^{2}+...+r^{2}i^{\left(t-2\right)}+r^{1}i^{\left(t-1\right)}+r^{0}i^{t}\right)$$
Since \\(r=i\\), we can substitute \\(r\\) with \\(i\\), then merge the exponents since they share the same base: \
$$c\left(i^{t}+i^{t}+i^{t}+...+i^{t}+i^{t}+i^{t}\right)$$
Factoring the expression once more gives us: \
$$c\left(t+1\right)i^{t}$$
Like last time, we need to remove the last term. This gives us our equation for finding \\(A\\) when \\(r=i\\). \
$$A=cti^{t}$$
Again, we need to implement the discrete compount interest formula by substituting \\(i\\) with \\(\left(1+\frac{i}{n}\right)\\) and \\(t\\) with \\(nt\\) in order to find the contribution for the very first period. \
$$A=cnt\left(1+\frac{i}{n}\right)^{nt}$$
The equation to find \\(c\\) would be: \
$$c=\frac{A}{nt\left(1+\frac{i}{n}\right)^{nt}}$$
Its summation, which is needed to tabularize the values, would just be a modification of the discrete compound interest formula: \
$$\sum_{k=0}^{nt}c\left(1+\frac{i}{n}\right)^{nt}$$
The sequence to tabularize the individual contribution values would be the same as last time since it only ever needed one of the growth rates. \
$$c_{k}=c\left(1+\frac{i}{n}\right)^{\left(k\right)}$$
