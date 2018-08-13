
let countMockDependency2Instances = 0;

module.exports = () => {
  const diMockDependency2 = {
    id: countMockDependency2Instances,
  };
  countMockDependency2Instances += 1;
  return diMockDependency2;
};

