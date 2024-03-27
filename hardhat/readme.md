[chai.js断言框架用于帮助编写测试脚本](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)
[ethers.js](https://docs.ethers.org/v5/)
--------------------------------------------------------------------------------
                                                                                
为了部署合约，我们首先需要对我们的配置文件进行一些更改。在此之前，请安装以下依赖项      
```
npm install dotenv
```
Dotenv 是一个零依赖模块，它将环境变量从.env 文件加载到process.env 中。

为了使用dotenv，我们需要在hardhat.config.js顶层导入它

---------------------------------------------------------------------------------

告诉你每个单元测试的gas使用量
```
npm install --save-dev hardhat-gas-reporter
```

---------------------------------------------------------------------------------

对合约进行覆盖率测试
```
npm install --dev solidity-coverage 
```
通过npx hardhat coverage运行

-----------------------------------------------------------------------------------
